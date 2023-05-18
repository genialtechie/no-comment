// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Configuration, OpenAIApi } from 'openai';

const apiKey = process.env.OPENAI_API_KEY;
const organization = process.env.OPENAI_ORG_ID;
const config = new Configuration({
  organization,
  apiKey,
});
const api = new OpenAIApi(config);

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "no-comment" is now active!');

  context.subscriptions.push(
    vscode.commands.registerCommand('no-comment.insertComment', insertComment)
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}

async function analyzeLine(line: string): Promise<string> {
  const prompt = `You are a programming assistant. You are given a code snippet to analyze. You are asked to write a comment for the code snippet. Summarize the code snippet in eight words or less. The code snippet is:\n\n${line}\n\nComment:`; // Summarize code in 8 words.

  try {
    const completion = await api.createCompletion({
      model: 'text-davinci-003',
      prompt,
    });

    const comment = completion.data.choices[0].text?.trim();

    if (!completion.data || !completion.data.choices || !comment) {
      throw new Error('No comment generated');
    }

    return comment;
  } catch (error) {
    vscode.window.showErrorMessage('Failed to insert comment');
    throw new Error(`API call failed: ${error}`);
  }
}

async function insertComment() {
  try {
    const editor = vscode.window.activeTextEditor; // Access active text editor in VSCode.
    if (!editor) {
      // Check for editor object existence.
      vscode.window.showErrorMessage('No active editor');
      throw new Error('No active editor'); // Throws an error for no active editor.
    }

    const currentPos = editor.selection.active; // Moving editor cursor position.
    const currentLine = editor.document.lineAt(currentPos.line).text.trim(); // Trim text of current line in editor.

    if (!currentLine) {
      vscode.window.showInformationMessage('No code on the current line');
      throw new Error('No code on the current line');
    }

    const comment = await analyzeLine(currentLine);
    editor.edit((editBuilder) => {
      editBuilder.insert(currentPos, ` // ${comment}`);
    });

    vscode.window.showInformationMessage('Comment inserted');
  } catch (error) {
    console.error(error);
    vscode.window.showErrorMessage('Failed to insert comment');
  }
}
