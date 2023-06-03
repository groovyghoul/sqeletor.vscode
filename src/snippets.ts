import * as vscode from "vscode";

interface Action {
    key: string;
    label: string;
}

const actions: Action[] = [
    { key: "simpleSelect", label: "Simple Select" },
    { key: "tempProcedure", label: "Temp Procedure" },
    { key: "action3", label: "Action 3" },
];

export async function snippets() {
    const options = actions.map((action) => action.label);

    const selectedAction = await vscode.window.showQuickPick(options, {
        placeHolder: "Select an action",
    });

    if (selectedAction) {
        const selectedActionKey = actions.find(
            (action) => action.label === selectedAction
        )?.key;
        if (selectedActionKey) {
            switch (selectedActionKey) {
                case "simpleSelect":
                    simpleSelect();
                    break;
                case "tempProcedure":
                    tempProcedure();
                    break;
                case "action3":
                    action3();
                    break;
                default:
                    break;
            }
        }
    }
}

function simpleSelect() {
    const snippetString = new vscode.SnippetString("select * from table");
    vscode.window.activeTextEditor?.insertSnippet(snippetString);
}

function tempProcedure() {
    const stringArray: string[] = [];
    stringArray.push("create procedure temp_proc");
    stringArray.push("as");
    stringArray.push("    declare variable var_ integer;");
    stringArray.push("begin");
    stringArray.push("");
    stringArray.push("end!");
    stringArray.push("");
    stringArray.push("commit !");
    stringArray.push("execute procedure temp_proc !");
    stringArray.push("commit !");
    stringArray.push("drop procedure temp_proc !");
    stringArray.push("commit !");

    const stringBuilder = stringArray.join("\n");

    const snippetString = new vscode.SnippetString(stringBuilder);
    vscode.window.activeTextEditor?.insertSnippet(snippetString);
}

function action3() {
    const configuration = vscode.workspace.getConfiguration('sqeletor');
    const snippetFolderPath = configuration.get('snippetFolderPath', '');
    vscode.window.showInformationMessage(`User snippet path: ${snippetFolderPath}`);
}
