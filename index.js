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

    if(action === 'Criar Conta') {
        createAccount()
    } else if (action === 'Consultar Saldo') {
        getAccountBalance()
    } else if (action === 'Depositar') {
        deposit()
    } else if (action === 'Sacar') {
        withdraw()
    } else if (action === 'Sair') {
        console.log(chalk.yellow('Obrigado por usar o Accounts!'))
        process.exit()
    }
})
.catch((err) => {console.log(err)})
}

// create an account 

function createAccount() {
    console.log(chalk.yellow('Parabéns por escolher o nosso banco!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir:'))

    buildAccount()
}

function buildAccount() {

    inquirer
        .prompt([
            {
                name: 'accountName',
                message: 'Digite um nome para a sua conta:'
            }
]).then((answer) =>{
    const accountName = answer['accountName']

    // create diretory 'accounts'
    if(!fs.existsSync('accounts')) {
        fs.mkdirSync('accounts')
    }

    if(fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(
            chalk.bgRed.black('Esta conta já existe, escolha outro nome!')
        )
        buildAccount()
        return
    }

    fs.writeFileSync(
        `accounts/${accountName}.json`, 
        '{"balance": 0}',
        function (err) {
            console.log(err)
        }
    )

    console.log(chalk.green('Parabéns, a sua conta foi criada!'))
    operation()

}).catch((err)=> {
    console.log(err)
})
}

// add an amount to user account
function deposit() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
])
.then((answer) => {

    const accountName = answer['accountName']

    // verify if account exists
    if(!checkAccount(accountName)) {
        return deposit()
    }

    inquirer.prompt([
        {
            name: 'amount',
            message: 'Quanto você deseja depositar?',

        }
    ]).then((answer) => {

        const amount = answer['amount']

        // add an amount
        addAmount(accountName, amount)
        operation()

    }).catch( err => console.log(err))
    

})
.catch((err) => {
    console.log(err)
})
}

function checkAccount(accountName) {

    if(!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe. Tente novamente!'))
        return false
    }

    return true
}

function addAmount(accountName, amount) {

    const accountData = getAccount(accountName)
    
    if(!amount) {
       console.log(chalk.bgRed.black('Ocorreu um erro! Tente novamente mais tarde!')) 
       return false
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }
    )

    console.log(
        chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`)
    )

}

// account file in json

function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r'
    })

    return JSON.parse(accountJSON)
}

// show account balance
function getAccountBalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }   
]).then((answer) => {
    
    const accountName = answer['accountName']

    // verify if account exists
    if(!checkAccount(accountName)) {
        return getAccountBalance()
    }

    const accountData = getAccount(accountName)
    console.log((`Olá, o saldo da sua conta é de`),chalk.yellow(`R$${accountData.balance}`))

})
.catch(err => console.log(err))

}

// withdraw an amount from user account
function withdraw() {

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
]).then((answer) => {

    const accountName = answer['accountName']

    if(!checkAccount(accountName)) {
        return withdraw()
    }

    inquirer.prompt([
        {
            name: 'amount',
            message: 'Quanto você deseja sacar?'
        }
]).then((answer) => {

    const amount = answer['amount']
    removeAmount(accountName, amount)

})
.catch(err => console.log(err))
})
.catch(err => console.log(err))
}

function removeAmount(accountName, amount) {

    const accountData = getAccount(accountName)

    if(!amount) {
        console.log(chalk.bgRed.black('Erro! Tente novamente mais tarde!'))
        return withdraw()
    }

    if(accountData.balance < amount) {
        console.log(chalk.bgRed.black('Valor indisponível!'))
        return withdraw()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function(err) {
            console.log(err)
        }
    )

    console.log(chalk.green(`Foi realizado um saque de R$${(amount)} da sua conta!`))
    operation()

}



