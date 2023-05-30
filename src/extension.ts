import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    let disposable1 = vscode.commands.registerCommand(
        "extension.createScript",
        async () => {
            const value1 = await vscode.window.showInputBox({
                prompt: "Enter script name (YYMMDDxxNN)",
                value: getCurrentDate(),
            });
            if (value1) {
                const value2 = await vscode.window.showInputBox({
                    prompt: "Enter ticket",
                });
                if (value2) {
                    const value3 = await vscode.window.showInputBox({
                        prompt: "Enter description",
                    });

                    // Generate the templated text
                    const template = `set term !;
                
                

set term ;!
                
insert into applied_scripts (name, description, script_date)
    values ('${value1}', '${value2} ${value3}', '${getAppliedScriptsDate()}');`;

                    // Create a new text document with the generated text
                    const doc = await vscode.workspace.openTextDocument({
                        language: "sql",
                        content: template,
                    });
                    const editor = await vscode.window.showTextDocument(doc);

                    const newPosition = new vscode.Position(2, 0);
                    const newSelection = new vscode.Selection(
                        newPosition,
                        newPosition
                    );

                    editor.selection = newSelection;
                }
            }
        }
    );

    let disposable2 = vscode.commands.registerCommand(
        "extension.createStoredProcedure",
        createStoredProcedure
    );

    context.subscriptions.push(disposable1, disposable2);
}

export function deactivate() {}

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
                    })
                    .then(handleInput);
            } else {
                // All inputs collected, create the templates
                const fileName = promptInputs[0].value;
                const ticketNumber = promptInputs[1].value;
                const description = promptInputs[2].value;
                const procName = promptInputs[3].value;

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
                            vscode.window.showTextDocument(doc, {
                                preview: false,
                                viewColumn: vscode.ViewColumn.Active,
                                preserveFocus: true,
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
                            vscode.window.showTextDocument(doc, {
                                preview: false,
                                viewColumn: vscode.ViewColumn.Active,
                                preserveFocus: true,
                            });
                        });
                    });
            }
        }
    };

    vscode.window
        .showInputBox({ prompt: promptInputs[currentPrompt].prompt })
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
