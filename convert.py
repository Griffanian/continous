import subprocess
import os

def convert_ppt_to_images(pptx_file, output_folder):
    # Convert PowerPoint to PDF
    subprocess.run(['unoconv', '-f', 'pdf', pptx_file])

    # Define the output PDF file path
    pdf_file = os.path.join(output_folder, os.path.splitext(os.path.basename(pptx_file))[0] + '.pdf')

    # Convert PDF to images
    subprocess.run(['pdftoppm', '-png', pdf_file, os.path.join(output_folder, 'slide')])

if __name__ == "__main__":
    convert_ppt_to_images('your_presentation.pptx', 'output_folder')
