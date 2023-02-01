const axios = require("axios").default;
const path = require("path");

const githubApi = axios.create({
  baseURL: "https://api.github.com/",
  headers: {
    "X-GitHub-Api-Version": "2022-11-28",
    accept: "application/vnd.github+raw",
  },
});

const ACCEPTED_BRANCHES = ["main", "master"];

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

    const mdFiles = files.tree.reduce((acc, file) => {
      if (path.extname(String(file.path)).toLowerCase() === ".md") {
        acc.push(file.path);
      }

      return acc;
    }, []);

    const tree = fileTree(mdFiles);

    const parsedTree = parseTree(tree);

    return parsedTree;
  }

  console.log("ERROR: main branch not found");
}

function fileTree(paths, tree = {}) {
  return paths.reduce((fullTree, path) => {
    const [first, ...rest] = path.split("/");

    if (!rest.length) {
      fullTree[first] = true;
      return fullTree;
    }

    fullTree[first] = fileTree([rest.join("/")], fullTree[first]);

    return fullTree;
  }, tree);
}

function parseTree(tree, path = "") {
  return Object.keys(tree).reduce((content, nodeKey) => {
    const node = tree[nodeKey];

    const fullPath = !path ? nodeKey : `${path}/${nodeKey}`;

    if (node === true) {
      content.push({
        name: nodeKey,
        path: fullPath,
      });
      return content;
    }

    content.push({
      name: nodeKey,
      items: parseTree(node, fullPath),
    });

    return content;
  }, []);
}

async function getFileContent({ user, repo, filePath }) {
  const { data } = await githubApi.get(
    `/repos/${user}/${repo}/contents/${filePath}`
  );

  const response = Buffer.from(String(data.content), "base64").toString(
    "utf-8"
  );

  return response;
}

(async () => {
  const files = await listMDFiles({
    user: "florinpop17",
    repo: "app-ideas",
  });

  const content = await getFileContent({
    user: "florinpop17",
    repo: "app-ideas",
    filePath: files.at(-1).path,
  });

  console.log(content);
})();
