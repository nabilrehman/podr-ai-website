const { chat } = require('./chat');

async function runTest() {
    try {
        await chat();
    } catch (error) {
        console.error('Error:', error);
    }
}

runTest();