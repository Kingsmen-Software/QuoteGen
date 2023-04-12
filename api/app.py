import os
import torch
from taming.models import vqgan
from torchvision.transforms import functional as TF
from PIL import Image
from flask import Flask, request, send_file
from io import BytesIO

app = Flask(__name__)

# Set device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load the pre-trained model
model_path = "models/celeba/checkpoints/last.ckpt"
config_path = "models/celeba/configs/2021-04-23T18-11-19-project.yaml"

model = vqgan.load_model(config_path, model_path, device=device)

# Load and preprocess images


def load_image(image_path):
    img = Image.open(image_path).convert("RGB")
    img = img.resize((256, 256), Image.LANCZOS)
    img_tensor = TF.to_tensor(img).unsqueeze(0).to(device)
    return img_tensor


@app.route("/generate-image", methods=["POST"])
def generate_image():
    data = request.get_json()
    opening_actor_name = data["openingActor"]
    closing_actor_name = data["closingActor"]

    images_folder = "path/to/your/images/folder"
    opening_actor_image_path = os.path.join(
        images_folder, f"{opening_actor_name}.jpg")
    closing_actor_image_path = os.path.join(
        images_folder, f"{closing_actor_name}.jpg")

    opening_actor_image = load_image(opening_actor_image_path)
    closing_actor_image = load_image(closing_actor_image_path)

    # Encode images to latent space
    with torch.no_grad():
        opening_actor_latent, _, _ = model.encode(opening_actor_image)
        closing_actor_latent, _, _ = model.encode(closing_actor_image)

    # Interpolate between latents
    alpha = 0.5  # Adjust this value between 0 and 1 to control the interpolation amount
    interpolated_latent = alpha * opening_actor_latent + \
        (1 - alpha) * closing_actor_latent

    # Decode the interpolated latent to generate an image
    with torch.no_grad():
        output_image = model.decode(interpolated_latent)

    # Convert the generated image to a PIL image
    output_image = output_image.squeeze(0).cpu()
    output_image = TF.to_pil_image(output_image)

    # Save the output image
    output_image.save("output.jpg")

    # Serve the image as a binary stream
    img_io = BytesIO()
    output_image.save(img_io, 'JPEG')
    img_io.seek(0)
    return send_file(img_io, mimetype='image/jpeg')


if __name__ == "__main__":
    app.run()
