import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-cadastrar-tarefas',
  standalone: true,
  imports: [
    //lib usada para carregas as categorias na combo categorias
    CommonModule,
    //são libs para contruir o formulário
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './cadastrar-tarefas.component.html',
  styleUrl: './cadastrar-tarefas.component.css'
})
export class CadastrarTarefasComponent {
    //atributos
    categorias: any[] = [];
    mensagem: string = '';
    mensagemErro: string = '';

    //método construtor (injeção de dependência)(usado para fazer a integração com a api)
    constructor(
      private httpClient: HttpClient
    ) {}

    //criando a estrutura do formulário (necessário para fazer o cadastro de tarefas - 
    //ficar igual ao json que a api espera receber)
    form = new FormGroup({
      nome : new FormControl(''),
      data : new FormControl(''),
      hora : new FormControl(''),
      prioridade : new FormControl(''),
      categoriaId : new FormControl('')
    });

    //Função executada no momento em que o componente for inicializado(para carregar a combo de categorias)
    ngOnInit() {
      //fazendo uma requisição GET para o endpoint de consulta de categorias
      this.httpClient.get(environment.apiTarefas + 'api/categorias')
        .subscribe({
          next: (data) => {
            this.categorias = data as any[];
          }
        });
    }

    //Função para capturar o evento de SUBMIT do formulário (para cadastro de tarefas)
    onSubmit() {
      //imprimir os campos do formulário no console do navegador
      //console.log(this.form.value); //teste F11 para inspecionar a página, console, vê o json montado que será passado para api
      
      //enviando os dados do formulário para a API
      this.httpClient.post(environment.apiTarefas + 'api/tarefas', this.form.value) //envia para api os campos do formulario
        .subscribe({//aguardando a resposta da API
          next: (data: any) => { //capturando um objeto json da API
            this.mensagem = data.mensagem; //"data": json de retorno / "mensagem": campo do json


            //limpar os campos do fomulário
            this.form.reset();

            //console.log(data); //imprimindo a resposta obtida
          },
          error: (e) => { //capturando resposta de erro
            this.mensagemErro = e.error.title;
            console.log(e.error); //imprimindo a resposta obtida
          }
        })

    
    
    
    }


}




