import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    let disposable1 = vscode.commands.registerCommand(
        "extension.createScript",
        createScript
    );

    let disposable2 = vscode.commands.registerCommand(
        "extension.createStoredProcedure",
        createStoredProcedure
    );

    context.subscriptions.push(disposable1, disposable2);
}

export function deactivate() {}

function createScript() {
    const promptInputs = [
        { prompt: "Enter script name (YYMMDDxxNN)", value: getCurrentDate() },
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
    values ('${fileName.toLowerCase()}', '${ticketNumber.toUpperCase()} ${description}', '${getAppliedScriptsDate()}');`;

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

function createStoredProcedure() {
    const promptInputs = [
        { prompt: "Enter script name (YYMMDDxxNN)", value: getCurrentDate() },
        { prompt: "Enter ticket", value: "" },
        { prompt: "Enter description", value: "" },
        { prompt: "Enter procedure name", value: "" },
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
                const procName = promptInputs[3].value.toLowerCase();

                // Template for the first file
                const firstFileTemplate = `set term !;

create procedure ${procName}()              
returns ()
as
begin
    suspend;
end!

set term ;!
                
insert into applied_scripts (name, description, script_date)
    values ('${fileName}', '${ticketNumber} ${description}', '${getAppliedScriptsDate()}');`;

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
                            firstFileTemplate
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

                // Template for the second file
                const secondFileTemplate = `set term !;

alter procedure ${procName}()
returns ()
as
begin

    suspend;
end!

set term ;!

/* add the following to the appropriate AIS8_Procedures.scl and remove this comment

   SCRIPT=${procName}.sps

*/
`;

                const secondFileVirtualUri = vscode.Uri.parse(
                    `untitled:${procName}.sql`
                );
                vscode.workspace
                    .openTextDocument(secondFileVirtualUri)
                    .then((doc) => {
                        const edit = new vscode.WorkspaceEdit();
                        edit.insert(
                            secondFileVirtualUri,
                            new vscode.Position(0, 0),
                            secondFileTemplate
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
                                        6,
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

function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");

    const currentDate = `${year}${month}${day}`;
    return currentDate;
}

function getAppliedScriptsDate() {
    const now = new Date();

    const year = now.getFullYear().toString();
    const month = getMonthAbbreviation(now.getMonth()).toUpperCase();
    const day = now.getDate().toString().padStart(2, "0");

    const currentDate = `${year}-${month}-${day}`;
    return currentDate;
}

function getMonthAbbreviation(month: number) {
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    return monthNames[month];
}
