//first create variable for db connection
let db;

const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;

    db.createObjectStore('new_line_item', { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;

    if(navigator.onLine) {
        uploadItem();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(['new_line_item'], 'readwrite');

    const itemObjectStore = transaction.objectStore('new_line_item');

    itemObjectStore.add(record);
};

function uploadItem() {
    const transaction = db.transaction(['new_line_item'], 'readwrite');

    const itemObjectStore = transaction.objectStore('new_line_item');

    const getAll = itemObjectStore.getAll();

    getAll.onsuccess = function() {
        if(getAll.result.length > 0) {
            fetch('api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if(serverResponse.message) {
                    throw new Error(serverResponse);
                }
                const transaction = db.transaction(['new_line_item'], 'readwrite')
                const itemObjectStore = transaction.objectStore('new_line_item');
                itemObjectStore.clear();
                alert('All line items have been submitted');
            })
            .catch(err => {
                console.log(err)
            })
        }
    }
};

window.addEventListener('online', uploadItem);