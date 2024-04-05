#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
const users = []; // Array to store user information
async function createUser() {
    let userData = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter your name:"
        },
        {
            type: "number",
            name: "pincode",
            message: "Enter your PIN code:"
        }
    ]);
    const randomBalance = Math.floor(Math.random() * (100000 - 1000 + 1)) + 2000;
    users.push({
        name: userData.name,
        pincode: userData.pincode,
        balance: randomBalance
    });
    console.log(chalk.green("User created successfully!"));
}
async function accessAccount() {
    let pincode = await inquirer.prompt([
        {
            type: "number",
            name: "pincode",
            message: "Enter your PIN code to access your account:"
        }
    ]);
    let user = users.find(u => u.pincode === pincode.pincode);
    if (user) {
        console.log(chalk.green("Welcome back, " + user.name + "!"));
        await atm(user);
    }
    else {
        console.log(chalk.red("User not found. Please create an account."));
        await createUser();
        await accessAccount();
    }
}
async function atm(user) {
    let show = await inquirer.prompt([
        {
            type: "list",
            name: "detail",
            message: "Select option",
            choices: ["Withdraw", "Check balance", "Donation", "Exit"]
        }
    ]);
    switch (show.detail) {
        case "Exit":
            let exitconfirm = await inquirer.prompt([
                {
                    type: "list",
                    name: "confirmexit",
                    message: "Confirm exit:",
                    choices: ["Confirm", "Ignore"]
                }
            ]);
            if (exitconfirm.confirmexit === "Confirm") {
                console.log(chalk.yellowBright("Exiting ATM. Goodbye!"));
                process.exit(0); // Exit the program
            }
            break;
        case "Withdraw":
            let show2 = await inquirer.prompt([
                {
                    type: "list",
                    name: "amount",
                    message: "Select amount to withdraw:",
                    choices: [1000, 2000, 3000, 4000, 5000, 10000]
                }
            ]);
            let selectedAmount = show2.amount;
            user.balance -= selectedAmount;
            console.log(chalk.yellow(`Now balance: ${chalk.red(user.balance)}`));
            break;
        case "Check balance":
            console.log(chalk.green(`Your balance: ${chalk.red(user.balance)}`));
            break;
        case "Donation":
            let donate = await inquirer.prompt([
                {
                    type: "list",
                    name: "donation",
                    message: "Select donation company:",
                    choices: ["Engro Corporation", "TCF", "HBL", "UBL", "PSO", "The Indus Hospital"]
                }
            ]);
            let donationName = donate.donation;
            let donateAmount = await inquirer.prompt([
                {
                    type: "list",
                    name: "d_money",
                    message: `Select amount for ${donationName}:`,
                    choices: [1000, 2000, 5000, 10000, 20000]
                }
            ]);
            let donateMoney = donateAmount.d_money;
            let confirm = await inquirer.prompt([
                {
                    type: "list",
                    name: "config",
                    message: "Verify to confirm:",
                    choices: ["Confirm", "Ignore"]
                }
            ]);
            if (confirm.config === "Confirm") {
                user.balance -= donateMoney;
                console.log(chalk.yellow(`Donation successful for ${chalk.green(donationName)}`));
                console.log(chalk.yellow(`New balance: ${user.balance}`));
            }
            else {
                console.log(chalk.red(`Donation cancelled`));
            }
            break;
    }
    await atm(user); // Recursively call atm() after completing the current operation
}
async function start() {
    await accessAccount();
}
start();
