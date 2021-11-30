const {contextBridge} = require('electron')
const {exec}= require('sudo-prompt');
const ps = require('ps-node')

var options = {
  name: 'Electron',
};

const getSerialNumber = function (cb) {
	var delimiter = ': ';

	var stdoutHandler = function (error, stdout) {
		cb(error, parseResult(stdout));
	};

	var parseResult = function (input) {
		var result = input.slice(input.indexOf(delimiter) + 2).trim();
		return result;
	};

	var vals = ['Serial', 'UUID'];
	var cmd;

	switch (process.platform) {

	case 'win32':
		delimiter = '\r\n';
		vals[0] = 'IdentifyingNumber';
		cmd = 'wmic csproduct get ';
		break;

	case 'darwin':
		cmd = 'system_profiler SPHardwareDataType | grep ';
		break;

	case 'linux':
		if (process.arch === 'arm') {
			vals[1] = 'Serial';
			cmd = 'cat /proc/cpuinfo | grep ';

		} else {
			cmd = 'dmidecode -t system | grep ';
		}
		break;

	case 'freebsd':
		cmd = 'dmidecode -t system | grep ';
		break;
	}

	exec( cmd + vals[0],options, function (error, stdout) {
		if (error || parseResult(stdout).length > 1) {
			stdoutHandler(error, stdout);
		} else {
			exec( cmd + vals[1],options, stdoutHandler);
		}
	});
};

const psSearch = (command, cb) => {
    ps.lookup({command}, (err, resultList) => {
        if(err){
            console.error(err)
            return
        }
        cb(resultList)
    })
}

contextBridge.exposeInMainWorld('electron', {
    getSerialNumber,
    psSearch
})