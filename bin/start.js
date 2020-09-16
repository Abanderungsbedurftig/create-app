#!/usr/bin/env node
const fs = require("fs-extra");
const path = require("path");
const https = require("https");
const { exec } = require("child_process");

const packageJson = require("../package.json");

const scripts = `"dev": "webpack-dev-server --config webpack.config.dev.js",
  "build": "cross-env NODE_ENV=production webpack --config webpack.config.prod.js"`;

const getDeps = (deps) =>
  Object.entries(deps)
    .map((dep) => `${dep[0]}@${dep[1]}`)
    .toString()
    .replace(/,/g, " ")
    .replace(/^/g, "")
    // исключим зависимость, используемую только в этом файле, не относящуюся к шаблону
    .replace(/fs-extra[^\s]+/g, "");

console.log("Initializing project..");

// создадим папку и инициализируем npm-проект
// exec(
//   `mkdir ${process.argv[2]} && cd ${process.argv[2]} && yarn init -y`,
//   (initErr, initStdout, initStderr) => {
//     if (initErr) {
//       console.error(`Everything was fine, then it wasn't:
//     ${initErr}`);
//       return;
//     }
//     const packageJSON = `${process.argv[2]}/package.json`;
//     // заменим скрипты, задаваемые по умолчанию
//     fs.readFile(packageJSON, (err, file) => {
//       if (err) throw err;
//       const data = file
//         .toString()
//         .replace(
//           '"test": "echo \\"Error: no test specified\\" && exit 1"',
//           scripts
//         )
//         // .replace('"keywords": []', babel);
//       fs.writeFile(packageJSON, data, (err2) => err2 || true);
//     });
  
  const packageJSON = 'package.json';
  // заменим скрипты, задаваемые по умолчанию
  fs.readFile(packageJSON, (err, file) => {
    if (err) throw err;
    const data = file
      .toString()
      .replace(
        '"test": "echo test"',
        scripts
      )
    fs.writeFile(packageJSON, data, (err2) => err2 || true);
  });

  const filesToCopy = [
    "webpack.config.cmn.js", 
    "webpack.config.dev.js",
    "webpack.config.prod.js",
    "eslintrc.js",
    ".eslintignore",
    "tsconfig.eslint.json"
  ];

  for (let i = 0; i < filesToCopy.length; i += 1) {
    fs.createReadStream(path.join(__dirname, `../${filesToCopy[i]}`)).pipe(
      fs.createWriteStream(`${filesToCopy[i]}`)
    );
  }

  // npm, при установке пакета, удалит файл .gitignore, поэтому его нельзя скопировать из локальной папки шаблона; этот файл нужно загрузить. После отправки кода в GitHub-репозиторий пользуйтесь raw-файлом .gitignore
  https.get(
    "https://raw.githubusercontent.com/Nikhil-Kumaran/reactjs-boilerplate/master/.gitignore",
    (res) => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", (data) => {
        body += data;
      });
      res.on("end", () => {
        fs.writeFile(
          '.gitignore',
          body,
          { encoding: "utf-8" },
          (err) => {
            if (err) throw err;
          }
        );
      });
    }
  );

  console.log("yarn init -- done\n");

  // установка зависимостей
  console.log("Installing deps -- it might take a few minutes..");
  const devDeps = getDeps(packageJson.devDependencies);
  const deps = getDeps(packageJson.dependencies);
  exec(
    `node -v && npm -v && yarn add ${deps} && yarn add -D ${devDeps}`,
    (npmErr, npmStdout, npmStderr) => {
      if (npmErr) {
        console.error(`Some error while installing dependencies
    ${npmErr}`);
        return;
      }
      console.log(npmStdout);
      console.log("Dependencies installed");

      console.log("Copying additional files..");
      // копирование дополнительных файлов с кодом
      fs.copy(path.join(__dirname, "../src"), 'src')
        .then(() =>
          console.log(
            `All done!\n\nYour project is now ready\n\nUse the below command to run the app.\n\ncd ${process.argv[2]}\nnpm start`
          )
        )
        .catch((err) => console.error(err));
    }
  );
