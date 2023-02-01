const axios = require("axios").default;
const path = require("path");
const _ = require("lodash");

const githubApi = axios.create({
  baseURL: "https://api.github.com/",
  headers: {
    "X-GitHub-Api-Version": "2022-11-28",
    accept: "application/vnd.github+raw",
  },
});

const ACCEPTED_BRANCHES = ["main", "master"];

function getFilename(path) {
  return path
    .split("/")
    .filter(function (value) {
      return value && value.length;
    })
    .reverse()[0];
}

function findSubPaths(path) {
  let rePath = path.replace("/", "\\/");
  let re = new RegExp("^" + rePath + "[^\\/]*\\/?$");
  return paths.filter(function (i) {
    return i !== path && re.test(i);
  });
}

function buildTree(path) {
  path = path || "";
  let nodeList = [];
  findSubPaths(path).forEach(function (subPath) {
    let nodeName = getFilename(subPath);
    if (/\/$/.test(subPath)) {
      var node = {};
      node[nodeName] = buildTree(subPath);
      nodeList.push(node);
    } else {
      nodeList.push(nodeName);
    }
  });

  return nodeList;
}

async function listMDFiles({ user, repo }) {
  const { data: branches } = await githubApi.get(
    `/repos/${user}/${repo}/branches`
  );

  const mainBranch = branches
    .map((branch) => branch.name)
    .find((name) => ACCEPTED_BRANCHES.includes(name));

  if (mainBranch) {
    const { data: files } = await githubApi.get(
      `/repos/${user}/${repo}/git/trees/${mainBranch}?recursive=1`
    );

    const mdFilesArray = files.tree.reduce((acc, file) => {
      if (path.extname(String(file.path)).toLowerCase() === ".md") {
        acc.push(`.root/${file.path}`);
      }

      return acc;
    }, []);

    mdFilesArray.unshift('.root/');

    // const mdFiles = mdFilesArray.filter(
    //   (file) => path.extname(String(file)).toLowerCase() === ".md"
    // );

    console.log(mdFilesArray);

    return;
  }

  console.log("ERROR: main branch not found");
}

async function getFileContent({ user, repo, filePath }) {
  const { data } = await githubApi.get(
    `/repos/${user}/${repo}/contents/${filePath}`
  );

  const response = Buffer.from(String(data.content), "base64").toString(
    "utf-8"
  );

  console.log(response);
}

(async () => {
  console.log(
    await listMDFiles({
      user: "florinpop17",
      repo: "app-ideas",
    })
  );

  // console.log(
  //   await listMDFiles({
  //     user: "agustinhopneto",
  //     repo: "morsa",
  //   })
  // );
})();
