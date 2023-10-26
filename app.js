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

// START: ===================== Constants =====================

// Log
var LOG_ERROR = 1;
// END:   ===================== Constants =====================

/**
 * This function reads the configuration and changes the power
 * plan accordingly.
 */
function loop(wmi, shell, wmi_power, programExecuteShell) {

	function getUUID(id) {
		return id.substr(id.indexOf('{') + 1, 36);
	}
	/**
	 * Changes the current power plan on the system if it exists
	 * and is not currently active
	 */
	function switchPowerPlan(plan) {
		plan = plan.toLowerCase();
		var plans = wmi_power.InstancesOf("Win32_PowerPlan");
		var e2 = new Enumerator (plans);
		for (; !e2.atEnd(); e2.moveNext()) {
			var p = e2.item();
			if(p.ElementName.toLowerCase() == plan) {
				if(!p.IsActive) {
					programExecuteShell.ShellExecute('powercfg.exe', '/setactive ' + getUUID(p.InstanceID));
				}
				break;
			}
		}
	}
	
	/**
	 * logs an exception if it happens and log is enabled
	 */
	function log(e) {
		if(!hasArgument('no-log')) {
			var msg = 'Power Plan Changer error log:\n';
			if(e.toString) msg += e.toString() + '\n';
			if(e.message) msg += 'message: ' + e.message + '\n';
			if(e.description) msg += 'desc: ' + e.description + '\n';
			if(e.name) msg += 'name: ' + e.name + '\n';
			if(e.number) msg += 'number: ' + e.number + '\n';
			if(e.lineNumber) msg += 'line num: ' + e.lineNumber + '\n';
			if(e.stack) msg += 'stack: ' + e.stack + '\n';
			shell.LogEvent(LOG_ERROR, msg);
		}
	}
	
	var config = null;
	var query = "Select Name FROM Win32_process WHERE ";
	try {
		eval('config=' + include(INSTALL_PATH + 'config.js') + ';');
	} catch(e) {
		log(e);
		WScript.Echo('Configuration file is corrupted.\n'
			+ 'Will try to reload in 5 minutes.\n\n'
			+ 'Please check syntax.');
		return 300;
	}
	try {
		var processList = config.list;
		var i = 0;
		for(; i < processList.length; i++) {
			if(i > 0) {
				query = query + " OR ";
			}
			query = query + " Name = '" + processList[i].name + "' ";
		}
		var processes = wmi.ExecQuery(query);

		var e = new Enumerator (processes);
		var precedence = -800000;
		var thePowerPlan = config.defaultPlan;
		for (; !e.atEnd(); e.moveNext()) {
			var pName = e.item().Name.toLowerCase();
			try {
				for(i = 0; i < processList.length; i++) {
					var processCfg = processList[i];
					if(pName == processCfg.name.toLowerCase()
						&& processCfg.precedence > precedence) {
						precedence = processCfg.precedence;
						thePowerPlan = processCfg.plan;
					}
				}
			} catch(e) {
				log(e);
			}
		}
		switchPowerPlan(thePowerPlan);
	} catch(e) {
		log(e);
	}
	return config.timeout;
}

/**
 * script entry point
 */
(function() {
	var programExecuteShell = WScript.CreateObject("Shell.Application");
	if(!hasArgument('no-elevate')) {
		WScript.Sleep(5000);
		programExecuteShell.ShellExecute(WScript.FullName,
			'"' + INSTALL_PATH + WScript.ScriptName
				+ '" --no-elevate "'
				+ ARGUMENTS.join('" "')
				+ '"',
			"", "runas");
		return;
	}
	// shell, wmi_power, programExecuteShell and wmi are cached for performance
	var wmi = GetObject("winmgmts:");
	var wmi_power = GetObject("winmgmts:\\\\.\\root\\cimv2\\power");
	var shell = WScript.CreateObject("Wscript.Shell");
	while(true) {
		var timeout = loop(wmi, shell, wmi_power, programExecuteShell);
		WScript.Sleep(timeout * 1000);
	}
}());