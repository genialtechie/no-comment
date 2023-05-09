// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Authenticator from 'openai-token';
import { ChatGPTUnofficialProxyAPI } from 'chatgpt';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "no-comment" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'no-comment.helloWorld',
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage('Hello World from no-comment!');
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

async function analyzeLine(line: string): Promise<string> {
  const accessToken = process.env.OPENAI_ACCESS_TOKEN || '';
  const api = new ChatGPTUnofficialProxyAPI({ accessToken });

  const prompt = `You are a programming assistant. You are given a code snippet to analyze. You are asked to write a comment for the code snippet. Summarize the code snippet in eight words or less. The code snippet is:\n\n${line}\n\nComment:`;

  try {
    const response = await api.sendMessage(prompt);
    return response.text;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

async function insertComment() {}
