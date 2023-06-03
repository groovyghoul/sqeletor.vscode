import * as vscode from "vscode";
import * as utilities from './utilities';

export function createScript() {
    const promptInputs = [
        { prompt: "Enter script name (YYMMDDxxNN)", value: utilities.getCurrentDate() },
        { prompt: "Enter ticket", value: "" },
        { prompt: "Enter description", value: "" },
    ];

    let currentPrompt = 0;

    const handleInput = (input: string | undefined) => {
        if (input) {
            promptInputs[currentPrompt].value = input;
            currentPrompt++;

            if (currentPrompt < promptInputs.length) {
                vscode.window
                    .showInputBox({
                        prompt: promptInputs[currentPrompt].prompt,
                        value: promptInputs[currentPrompt].value,
                    })
                    .then(handleInput);
            } else {
                // All inputs collected, create the templates
                const fileName = promptInputs[0].value.toLowerCase();
                const ticketNumber = promptInputs[1].value.toUpperCase();
                const description = promptInputs[2].value;

                // Generate the templated text
                const template = `set term !;
                
                

set term ;!
                
insert into applied_scripts (name, description, script_date)
    values ('${fileName.toLowerCase()}', '${ticketNumber.toUpperCase()} ${description}', '${utilities.getAppliedScriptsDate()}');`;

                const firstFileVirtualUri = vscode.Uri.parse(
                    `untitled:${fileName}.sql`
                );
                vscode.workspace
                    .openTextDocument(firstFileVirtualUri)
                    .then((doc) => {
                        const edit = new vscode.WorkspaceEdit();
                        edit.insert(
                            firstFileVirtualUri,
                            new vscode.Position(0, 0),
                            template
                        );

                        vscode.workspace.applyEdit(edit).then(() => {
                            vscode.window
                                .showTextDocument(doc, {
                                    preview: false,
                                    viewColumn: vscode.ViewColumn.Active,
                                    preserveFocus: true,
                                })
                                .then((editor) => {
                                    const newPosition = new vscode.Position(
                                        2,
                                        0
                                    );
                                    const newSelection = new vscode.Selection(
                                        newPosition,
                                        newPosition
                                    );
                                    editor.selection = newSelection;

                                    editor.revealRange(
                                        new vscode.Range(
                                            newPosition,
                                            newPosition
                                        ),
                                        vscode.TextEditorRevealType.InCenter
                                    );
                                    vscode.commands.executeCommand(
                                        "workbench.action.focusActiveEditorGroup"
                                    );
                                });
                        });
                    });
            }
        }
    };

    vscode.window
        .showInputBox({
            prompt: promptInputs[currentPrompt].prompt,
            value: promptInputs[currentPrompt].value,
        })
        .then(handleInput);
}