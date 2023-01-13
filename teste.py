from io import BytesIO
from PIL import Image
import requests


with open('testeimg_compact.jpg', 'wb') as nova_imagem:
    imagem = requests.get('https://i.ibb.co/2gJNTrK/Av-Francisco-Rodrigues-Filho-Rotat-ria-Retorno.jpg', stream=True)
    if not imagem.ok:
        print('Link de imagem inexistente.')
    else:
        for dado in imagem.iter_content():
            nova_imagem.write(dado)
imagem_pil = Image.open('testeimg_compact.jpg')
size = imagem_pil.size
if size[0] > 1280:
    new_image = imagem_pil.resize((1280, 768))
new_image = new_image.convert('RGB')
new_image.save('testeimg_compact.jpg', 'JPEG')