// modulos externos
const inquirer = require('inquirer')
const chalk = require('chalk')

// modulos internos
const fs = require('fs')
operation()

function operation() {
    inquirer
    .prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que deseja fazer?',
            choices: ['Criar Conta', 'Consultar Saldo', 'Depositar', 'Sacar', 'Sair']
        }
])
.then((answers) => {
    const action = answers['action']
    console.log(action)
})
.catch((err) => {console.log(err)})
}