import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-tarefas',
  standalone: true,
  imports: [
        //lib usada para carregas as categorias na combo categorias
        CommonModule,
        //são libs para contruir o formulário
        FormsModule,
        ReactiveFormsModule
  ],
  templateUrl: './editar-tarefas.component.html',
  styleUrl: './editar-tarefas.component.css'
})
export class EditarTarefasComponent {
  //atributos
  categorias: any[] = [];
  mensagem: string = '';
  mensagemErro: string = '';

  //variavel para guardar o id passado na url
  id: string = '';

  //método construtor (injeção de dependência)(usado para fazer a integração com a api)
  constructor(
    private httpClient: HttpClient,
    //para pegar qualquer variavel passada na url precisa utilizar a lib: "ActivatedRoute"
    private activatedRoute: ActivatedRoute
  ) {}
  
  //criando a estrutura do formulário (necessário para fazer a edição de tarefas - 
  //ficar igual ao json que a api espera receber)
  form = new FormGroup({
    nome : new FormControl(''),
    data : new FormControl(''),
    hora : new FormControl(''),
    prioridade : new FormControl(''),
    categoriaId : new FormControl('')
  });


  ngOnInit() {

    //capturando o ID da tarefa enviado na URL do link (rota)
    this.id = this.activatedRoute.snapshot.paramMap.get('id') as string;


    //fazendo uma requisição GET para o endpoint de consulta de tarefa por id
    this.httpClient.get(environment.apiTarefas + 'api/tarefas/' + this.id)
      .subscribe({
        next: (data: any) => {

          const dataParts = data.data.split(' ')[0].split('/');
          const formattedDate = `${dataParts[2]}-${dataParts[1]}-${dataParts[0]}`;  

          const horaParts = data.hora.split(':');
          const formattedTime = `${horaParts[0]}:${horaParts[1]}`

          //preenchendo os campos do formulário com os dados da tarefa
          this.form.get('nome')?.setValue(data.nome);
          this.form.get('data')?.setValue(formattedDate);
          this.form.get('hora')?.setValue(formattedTime);
          this.form.get('categoriaId')?.setValue(data.categoria.id);


          if(data.prioridade == 'Baixa') this.form.get('prioridade')?.setValue("1")
          else if (data.prioridade == 'Media') this.form.get('prioridade')?.setValue("2")
          else if (data.prioridade == 'Alta') this.form.get('prioridade')?.setValue("3")  
        }
      })


    this.httpClient.get(environment.apiTarefas + 'api/categorias/')
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
      this.httpClient.put(environment.apiTarefas + 'api/tarefas/' + this.id, this.form.value) //envia para api os campos do formulario
        .subscribe({//aguardando a resposta da API
          next: (data: any) => { //capturando um objeto json da API

            this.mensagem = data.mensagem; //"data": json de retorno / "mensagem": campo do json

            //console.log(data); //imprimindo a resposta obtida
          },
          error: (e) => { //capturando resposta de erro
            this.mensagemErro = e.error.title;
            console.log(e.error); //imprimindo a resposta obtida
          }
        })
      }
}
