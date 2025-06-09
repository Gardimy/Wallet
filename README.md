<a name="readme-top"></a>

<div align="center">
  <br/>
  <h1><b>WALLET_API - Full Stack Wallet System</b></h1><a name="about-project"></a>
</div>

# 📗 Table of Contents

- [📗 Table of Contents](#-table-of-contents)
- [📖🚗 Full Stack Wallet System ](#-luxury-speedsters-app-)
  - [🛠 Built With ](#-built-with-)
    - [Tech Stack ](#tech-stack-)
    - [Key Features ](#key-features-)
  - [🚀 Live Demo ](#-live-demo-)
  - [🎫 Kanban Board ](#-kanban-board-)
  - [💻 Getting Started ](#-getting-started-)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Install](#install)
    - [Usage](#usage)
    - [Run tests](#run-tests)
  - [👥 Authors ](#-authors-)
  - [🔭 Future Features ](#-future-features-)
  - [🤝 Contributing ](#-contributing-)
  - [⭐️ Show your support ](#️-show-your-support-)
  - [🙏 Acknowledgments ](#-acknowledgments-)
  - [❓ FAQ ](#-faq-)
  - [📝 License ](#-license-)

# 📖🚗 WALLET_API - Full Stack Wallet System <a name="about-project"></a>
Wallet_Api is a simplified electronic wallet system that enables users to create a personal wallet, receive funds from a central Ledger Account, and perform wallet-to-wallet transfers. The system implements double-entry accounting for every transaction to maintain data integrity and traceability.

The project exposes a RESTful API built using:

    Backend: nest.js

    Database: postgres sql

    Auth via x-pin header for sensitive wallet operations
## 🛠 Built With <a name="built-with"></a>

> List of technologies used for this project

<details>
  <summary>BackEnd</summary>
  <ul>
    <li><a href="https://nestjs.com/">NEST.JS</a></li>
  </ul>
</details>

<details>
  <summary>Database</summary>
  <ul>
    <li><a href="https://www.postgresql.org/">PostgreSQL</a></li>
  </ul>
</details>

<details>
  <summary>Micro-ORM</summary>
  <ul>
    <li><a href="https://mikro-orm.io/">Micro-ORM</a></li>
  </ul>
</details>

## Key Features <a name="key-features"></a>

✅ Create Wallet
✅ Recharge Wallet from Ledger
✅ View Wallet Profile
✅ View Wallet Balance
✅ Wallet to Wallet Transfer (with 2% fees)
✅ View Wallet Transaction History
✅ Ledger Status & Ledger Transaction History
✅ Double-entry Accounting

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# 🚀 Live Demo <a name="live-demo"></a>

[Under Construction](TBA) 💻📲

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 💻 Getting Started <a name="getting-started"></a>

To get a local copy up and running, follow these steps.

### Prerequisites

In order to run this project you need:

git clone https://github.com/Gardimy/Wallet.git

you need to install ruby 3.2.2 using the prefer tool, example:

- [nest](https://docs.nestjs.com/)
- [nest](https://github.com/nestjs/nest)

- Browser (Google Chrome, Mozilla Firefox, Safari or any other browser)

### Setup

Clone this repository to your desired folder:


```sh
  cd my-folder
  git clone https://github.com/Gardimy/Wallet.git

  ### Install

Install this project with:


```sh
  cd Wallet
  npm install
  npm start
  npm run start:dev
or yarn start:dev

```
## Configure environment
```cp .env.example .env```
 Edit .env with your DB credentials

## Run Database Migrations

npm run mikro-orm migration:up

 or yarn mikro-orm migration:up

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 👥 Authors <a name="authors"></a>

👤 **Gardimy Charles** 🐱‍👤
- GitHub: [@Gardimy](https://github.com/Gardimy)
- Twitter: [@gardyelontiga45](https://twitter.com/gardyelontiga45)
- LinkedIn: [Gardimy charles](https://www.linkedin.com/in/gardimycharles/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🔭 Future Features <a name="future-features"></a>

- [ ] **Add more functionalities**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🤝 Contributing <a name="contributing"></a>

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](https://github.com/Gardimy/Wallet/issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# ⭐️ Show your support <a name="support"></a>

If you like this project,please give it a ⭐️!


<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🙏 Acknowledgments <a name="acknowledgements"></a>

We would like to thank Haitipay for giving mme the opportunity to learn and grow as developers. 🌟

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## ❓ FAQ <a name="faq"></a>

- **Do I need to install any program before running this project?**

  - [ ] **Yes, you need to install nestjs** 
  
  <br>

- **Can I use this project for my own purposes?**

  - [ ] **Yes, you can.**

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## 📝 License <a name="license"></a>


THis project is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

