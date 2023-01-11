import { Book } from "./classes.js";

var books = []
var menu = document.querySelector('#menu')
var lista = document.querySelector('#lista')

var alertGenerate = function(parentElement, text) {
    let alert = document.createElement('div')
    alert.className = 'alert alert-warning alert-dismissible fade show'
        alert.role = 'alert'
        alert.innerHTML = `
            ${text}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `
    parentElement.insertAdjacentElement('afterbegin', alert)
}

function carregarLista() {
    lista.innerHTML = `
    <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
    `
    let listaBooks = fetch('/pdfservice/painel-administrativo/lista-de-books?filter=all')
    .then(function(response) {
        if (response.ok) {
            return response.json()
            .then(function(data) {
                data.forEach(element => {
                    let ano = element.creation_date.substring(0, 4)
                    let mes = element.creation_date.substring(5, 7)
                    let dia = element.creation_date.substring(8, 10)
                    let book = new Book(
                        element.id,
                        element.title,
                        element.content,
                        `${dia}/${mes}/${ano}`,
                        element.image_id,
                    )
                    books.push(book)
                });
                atualizarLista()
            })
        } else {
            lista.innerHTML = ''
            alertGenerate(menu, 'Erro ao carregar os Dados. Tente novamente.')
        }
    })
}

function atualizarLista() {
    lista.innerHTML = ''
    books.forEach(element => {
        let bookNome = element.title != null ? (element.title).replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase()) : null
        let bookId = element.id
        let bookData = element.creation_date
        let image_id = element.image_id

        let linha = document.createElement('div')
        linha.className = 'linha'

        let data = document.createElement('div')
        data.className = 'linha-data'
        data.innerHTML = bookData

        let nome = document.createElement('div')
        nome.className = 'linha-nome'
        nome.innerHTML = bookNome

        //Botão visualizar
        let visualizar = document.createElement('div')
        visualizar.className = 'linha-bt'
        let visualizarBt = document.createElement('button')
        visualizarBt.type = 'button'
        visualizarBt.className = 'btn btn-sm btn-warning linha-bt-bt'
        visualizarBt.innerHTML = 'Abrir'
        visualizarBt.addEventListener('click', () => {
            window.open(`/pdfservice/pdfview/${image_id}.pdf`)
        })
        visualizar.appendChild(visualizarBt)

        // Botão Baixar PDF
        let baixarPDF = document.createElement('div')
        baixarPDF.className = 'linha-bt'

        let baixarPDFBt = document.createElement('button')
        baixarPDFBt.type = 'button'
        baixarPDFBt.className = 'btn btn-sm btn-danger linha-bt-bt'
        baixarPDFBt.innerHTML = 'Baixar PDF'
        baixarPDFBt.addEventListener('click', () => {
            window.open(`/pdfservice/painel-administrativo/lista-de-books?filter=downloadpdf&arg=${image_id}.pdf`)
        })
        baixarPDF.appendChild(baixarPDFBt)
        
        // Botão Baixar PPTX
        let baixarPPTX = document.createElement('div')
        baixarPPTX.className = 'linha-bt'

        let baixarPPTXBt = document.createElement('button')
        baixarPPTXBt.type = 'button'
        baixarPPTXBt.className = 'btn btn-sm btn-danger linha-bt-bt'
        baixarPPTXBt.innerHTML = 'Baixar PPTX'
        baixarPPTXBt.addEventListener('click', () => {
            window.open(`/pdfservice/painel-administrativo/lista-de-books?filter=downloadpptx&arg=${image_id}.pptx`)
        })
        baixarPPTX.appendChild(baixarPPTXBt)

        //Botão Gerar Novamente
        let gerarNovamente = document.createElement('div')
        gerarNovamente.className = 'linha-bt gerar-novamente'

        let gerarNovamenteBt = document.createElement('button')
        gerarNovamenteBt.type = 'button'
        gerarNovamenteBt.className = 'btn btn-sm btn-dark linha-bt-bt gerar-novamente-bt'
        gerarNovamenteBt.innerHTML = 'Gerar Novamente'
        gerarNovamenteBt.addEventListener('click', () => {
            $('#staticBackdrop').modal('show')
            window.location.href = `/pdfservice/painel-administrativo/lista-de-books?filter=gerarNovamente&arg=${element.id}`
        })
        gerarNovamente.appendChild(gerarNovamenteBt)

        let modalGerarNovamente = document.createElement('div')
        modalGerarNovamente.className = 'modal fade'
        modalGerarNovamente.id = 'staticBackdrop'
        modalGerarNovamente.setAttribute('data-bs-backdrop', 'static')
        modalGerarNovamente.setAttribute('data-bs-keyboard', 'false')
        modalGerarNovamente.tabIndex = '-1'
        modalGerarNovamente.setAttribute('aria-labelledby', 'staticBackdropLabel')
        modalGerarNovamente.ariaHidden = true
        modalGerarNovamente.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">Aguarde...</h5>
                </div>
                <div class="modal-body">
                    Fazendo o download das imagens e gerando os links e os documentos PDF e PPTX. Isso pode levar alguns minutos.
                    <div class="spinner-border text-warning" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
        `
        gerarNovamente.appendChild(modalGerarNovamente)
        
        // Botão Excluir
        let excluir = document.createElement('div')
        excluir.className = 'linha-bt'

        let excluirBt = document.createElement('button')
        excluirBt.type = 'button'
        excluirBt.className = 'btn btn-sm btn-secondary linha-bt-bt'
        excluirBt.innerHTML = 'Excluir'
        excluirBt.addEventListener('click', () => {
            $(`#excluir${bookId}`).modal('show')
        })
        excluir.appendChild(excluirBt)
        
        let excluirModal = document.createElement('div')
        excluirModal.className = 'modal'
        excluirModal.classList.add('fade')
        excluirModal.id = `excluir${bookId}`
        excluirModal.tabIndex = '-1'
        excluirModal.setAttribute('aria-labelledby', `exampleModalLabelExcluir${element.id}`)
        excluirModal.ariaHidden = true
        excluirModal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabelexcluir">Tem certeza?</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                Após a exclusão, todo o cadastro de ${nome.innerHTML} será apagado.
                </div>
                <form action="/pdfservice/painel-administrativo/lista-de-books" method="POST">
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <input type="hidden" name="tipo" value="excluir">
                        <input type="hidden" name="id" value="${bookId}">
                        <button type="submit" class="btn btn-warning">Confirmar</button>
                    </div>
                </form>
            </div>
        </div>
        `
        excluir.appendChild(excluirModal)
        
        linha.appendChild(data)
        linha.appendChild(nome)
        linha.appendChild(visualizar)
        linha.appendChild(baixarPDF)
        linha.appendChild(baixarPPTX)
        linha.appendChild(gerarNovamente)
        linha.appendChild(excluir)
        lista.appendChild(linha)
    })
}

window.onload = function() {
    carregarLista()
} 