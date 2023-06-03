import * as vscode from "vscode";
import { snippets } from './snippets';
import { createScript } from './script';
import { createStoredProcedure } from './storedProcedure';
import { userSnippets } from './userSnippets';


export function activate(context: vscode.ExtensionContext) {
    let disposable1 = vscode.commands.registerCommand(
        "extension.createScript",
        createScript
    );

    let disposable2 = vscode.commands.registerCommand(
        "extension.createStoredProcedure",
        createStoredProcedure
    );

    let disposable3 = vscode.commands.registerCommand(
        "extension.snippets",
        async () => {
            await snippets();
        }
    );

    let disposable4 = vscode.commands.registerCommand(
        "extension.userSnippets",
        async () => {
            await userSnippets();
        }
    );

    context.subscriptions.push(disposable1, disposable2, disposable3, disposable4);
}

export function deactivate() {}
