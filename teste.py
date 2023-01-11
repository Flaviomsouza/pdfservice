import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import mm
from io import BytesIO
import requests
from app.providers.s3_services import upload_file_to_s3
from dotenv import load_dotenv
load_dotenv()


# Gerando PDF
pdf_buffer = BytesIO()
pdf = canvas.Canvas(pdf_buffer, (400*mm, 220*mm))
pdf.drawString(100,100, 'TesteBuffer')
pdf.save()

with pdf_buffer as arquivo:
    pdf_upload = upload_file_to_s3(arquivo.getvalue(), 'public/teste_buffer2.pdf', 'application/pdf')
    if pdf_upload == False:
        message = 'Falha ao salvar o arquivo PDF. Apague o book e tente novamente.'
        send_message = requests.get(f'{os.environ["APP_URL"]}/pdfservice/flash-message-generate?message={message}', headers={'Secret-Key': os.environ['SECRET_KEY']})
pdf_buffer.close()