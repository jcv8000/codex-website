const versionRegex = /\d+\.\d+\.\d/;

function addTableElement(title, content, borderBottom = false) {
    let tr = document.createElement('tr');

    if (borderBottom === true) {
        tr.style.borderBottom = "2px solid #DEE2E6";
    }

    let left = document.createElement('td');
    left.textContent = title;
    tr.appendChild(left);

    let right = document.createElement('td');
    right.style.fontWeight = "600";
    right.textContent = content;
    tr.appendChild(right);

    document.getElementById('githubDownloadTable').appendChild(tr);
}

var xhr = new XMLHttpRequest();
xhr.addEventListener('load', function () {
    const releases = JSON.parse(this.responseText);

    let tableTotal = 0;
    var winstaller = [], winzip = [], deb = [], tarxz = [];

    for (let r = 0; r < releases.length; r++) {
        let release = releases[r];

        for (let a = 0; a < release.assets.length; a++) {
            let asset = release.assets[a];

            let name = asset.name;
            let downloads = parseInt(asset.download_count);

            let version = name.match(versionRegex);

            if (name.includes(".exe")) {

                if (!winstaller[version]) {
                    winstaller[version] = downloads;
                }
                else
                    winstaller[version] += downloads;

            }
            else if (name.includes(".zip")) {

                if (!winzip[version]) {
                    winzip[version] = downloads;
                }
                else
                    winzip[version] += downloads;

            }
            else if (name.includes(".deb")) {

                if (!deb[version]) {
                    deb[version] = downloads;
                }
                else
                    deb[version] += downloads;

            }
            else if (name.includes(".tar.xz")) {

                if (!tarxz[version]) {
                    tarxz[version] = downloads;
                }
                else
                    tarxz[version] += downloads;

            }

            addTableElement(name, downloads.toLocaleString("en-US", { minimumFractionDigits: 0 }), (a == release.assets.length - 1))
            tableTotal += downloads;

        }
    }

    addTableElement("Total", tableTotal.toLocaleString("en-US", { minimumFractionDigits: 0 }))

    var winstaller_line = {
        x: Object.keys(winstaller).reverse(),
        y: Object.values(winstaller).reverse(),
        mode: 'lines+markers',
        name: 'EXE'
    };

    var winzip_line = {
        x: Object.keys(winzip).reverse(),
        y: Object.values(winzip).reverse(),
        mode: 'lines+markers',
        name: 'ZIP'
    };

    var deb_line = {
        x: Object.keys(deb).reverse(),
        y: Object.values(deb).reverse(),
        mode: 'lines+markers',
        name: 'DEB'
    };

    var tarxz_line = {
        x: Object.keys(tarxz).reverse(),
        y: Object.values(tarxz).reverse(),
        mode: 'lines+markers',
        name: 'TAR.XZ'
    };

    var plotData = [winstaller_line, winzip_line, deb_line, tarxz_line];

    var layout = {
        height: 700
    }

    Plotly.newPlot("graph", plotData, layout, { displayModeBar: false, responsive: true });
});
xhr.open('GET', 'https://api.github.com/repos/jcv8000/Codex/releases');
xhr.send();