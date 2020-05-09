/*
Copyright (c) 2020, pedro-arruda-moreira
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// Power Plan Changer configuration.

{
	/**
	 * Default Power Plan when no processes on the list are running
	 */
	defaultPlan: "_75",
	/**
	 * Script will run at every [timeout] seconds.
	 * During execution, this config file will 
	 * also be reloaded.
	 * default: 60
	 */
	timeout: 60,
	/**
	 * list of processes to change power plan
	 * If two or more processes are found during scan,
	 * the one with biggest precedence will have it's
	 * power plan selected.
	 */
	list: [
		{name: "chrome.exe", plan: "_65", precedence: 0},
		{name: "winword.exe", plan: "_65", precedence: 0},
		{name: "excel.exe", plan: "_65", precedence: 0},
		{name: "powerpnt.exe", plan: "_65", precedence: 0},
		{name: "teamviewer.exe", plan: "_65", precedence: 0},
		{name: "ePSXe.exe", plan: "equilibrado", precedence: 1},
		{name: "gameoverlayui.exe", plan: "_85", precedence: 1},
		{name: "eclipse.exe", plan: "_85", precedence: 1},
		{name: "code.exe", plan: "_85", precedence: 1},
		{name: "pcsx2.exe", plan: "65_100", precedence: 1},
		{name: "AoE2DE_s.exe", plan: "_65", precedence: 2},
		{name: "XComGame.exe", plan: "_75", precedence: 2}
	]
}