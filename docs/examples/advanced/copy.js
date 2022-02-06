// file docs/examples/advanced/copy.js
// restructure february 2022 @ewingson
//
//code goes here
//?
console.log('copy.js execution');
const auth = solidClientAuthentication.getDefaultSession();
const fileClient = new SolidFileClient( auth, { enableLogging: true });
console.log('SolidFileClient object initialized');
//this seems to be the actual copy command
const { MERGE: { REPLACE, KEEP_SOURCE, KEEP_TARGET } } = SolidFileClient;
console.log('MERGE const');

console.log('process form');
        document.getElementById('copy-form').addEventListener('submit', async e => {
            e.preventDefault()
            console.log('submit event done');

            console.log('get elements by id');
        	const fromInput = document.getElementById('src')
       		const destInput = document.getElementById('dest')
        	const createPathInput = document.getElementById('create-path')
        	const withAclInput = document.getElementById('with-acl')
        	const withMetaInput = document.getElementById('with-meta')
        	const getMergeInput = () => document.querySelector('input[name="merge-option"]:checked')

            const from = fromInput.value
            const to = destInput.value
            const createPath = createPathInput.checked
            const withMeta = withMetaInput.checked
            const withAcl = withAclInput.checked

            const mergeVal = getMergeInput().value
            let merge = REPLACE
            if (mergeVal === 'keep-source')
                merge = KEEP_SOURCE
            else if (mergeVal === 'keep-target')
                merge = KEEP_TARGET

            console.log('set response');
            const responseToMsg = response => `${response.status} ${response.statusText} ${response.url}`

            console.log('codeblock main // MOVED');
            const addSuccessLog = msg => $('.logs').append(`<li class="list-group-item list-group-item-success">${msg}</li>`)
            const addErrorLog = msg => $('.logs').append(`<li class="list-group-item list-group-item-danger">${msg}</li>`)
            resetLogs()

            try {
              console.log('set copy status true');
                setCopyStatus(true)
                resetLogs()

                // Copy a file or folder
                console.log('actual copy work');
                const res = await fileClient.copy(from, to, {
                    merge,
                    createPath,
                    withAcl,
                    withMeta
                })
                res.forEach(response => {
                    const msg = responseToMsg(response)
                    console.log(msg)
                    addSuccessLog(msg)
                })
            } catch (err) {
                err.rejectedErrors.forEach(err => {
                    console.error(err)
                    addErrorLog(err.message)
                })
            }
            console.log('set copy status false');
            setCopyStatus(false)
            console.log('set log status true');
            setLogStatus(true)
        })

const setCopyStatus = isCopying => {
            if (isCopying) {
                $('.not-copying').hide()
                $('.copying').show()
                console.log('show copying');
            } else {
                $('.not-copying').show()
                $('.copying').hide()
                console.log('show not copying');
            }
        }
        setCopyStatus(false)

        const setLogStatus = showLogs => {
            if (showLogs) {
                $('.logs').show()
                console.log('show logs');
            } else {
                $('.logs').hide()
                console.log('hide logs');
            }
        }
        const resetLogs = () => {
          console.log('reset logs');
            setLogStatus(false)
            $('.logs').empty()
            console.log('logs resetted');
        }
