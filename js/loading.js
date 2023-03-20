let stopLoading = function () {
    window.onload = () => {
        let inputElement = document.querySelector('#file-name');
        inputElement.disabled = false;
    };
}