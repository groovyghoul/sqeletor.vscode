import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

interface Metadata {
    [key: string]: string;
}

interface Action {
    key: string;
    label: string;
}

export async function userSnippets() {
    const actions: Action[] = readActionsFromFiles(getSnippetPath());

    const options = actions.map((action) => action.label);

    const selectedAction = await vscode.window.showQuickPick(options, {
        placeHolder: "Select an action",
    });

    if (selectedAction) {
        const selectedActionKey = actions.find(
            (action) => action.label === selectedAction
        )?.key;
        if (selectedActionKey) {
            test(selectedActionKey);
        }
    }
}

function getSnippetPath() {
    const configuration = vscode.workspace.getConfiguration("sqeletor");
    const snippetFolderPath = configuration.get("snippetFolderPath", "");

    return snippetFolderPath;
}

function test(fileName: string) {
    const snippetFolderPath = getSnippetPath();

    const filePath = path.join(snippetFolderPath, `${fileName}.txt`);
    const { metadata, contents } = readFile(filePath);
    const key = metadata["key"];
    const label = metadata["label"];
    const snippetString = new vscode.SnippetString(contents);
    vscode.window.activeTextEditor?.insertSnippet(snippetString);
}

function readFile(filePath: string): { metadata: Metadata; contents: string } {
    const fileContent = fs.readFileSync(filePath, "utf-8");

    const metadataEndIndex = fileContent.indexOf("---");
    const metadataSection = fileContent.substring(0, metadataEndIndex).trim();
    const contents = fileContent.substring(metadataEndIndex + 3).trim();

    const metadataPairs = metadataSection
        .split("\n")
        .map((pair) => pair.trim().split("="));
    const metadata: Metadata = {};
    metadataPairs.forEach(([key, value]) => {
        metadata[key] = value;
    });

    return { metadata, contents };
}

function readActionsFromFiles(directoryPath: string): Action[] {
    const fileNames = fs.readdirSync(directoryPath);

    const actions: Action[] = [];

    fileNames.forEach((fileName) => {
        const filePath = path.join(directoryPath, fileName);
        const { metadata } = readFile(filePath);

        const key = metadata["key"];
        const label = metadata["label"];
        if (key && label) {
            actions.push({ key, label });
        }
    });

    return actions;
}
