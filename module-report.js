const getModuleInfo = () => {
    return game.modules.keys().toArray().map(module => {
        return {
            name: game.modules.get(module).title,
            id: module,
            version: game.modules.get(module).version,
            description: game.modules.get(module).description
        };
    });
}

const exportToJSON = () => {
    return JSON.stringify(getModuleInfo());
}

const exportToXML = () => {
    const moduleInfo = getModuleInfo();
    let xmlString = "<modules>";
    moduleInfo.forEach(module => {
        xmlString += `<module>`;
        for (const [key, value] of Object.entries(module)) {
            xmlString += `<${key}>${value}</${key}>`;
        }
        xmlString += `</module>`;
    });
    xmlString += "</modules>";
    return xmlString;
}

const exportToCSV = () => {
    const moduleInfo = getModuleInfo();
    const header = Object.keys(moduleInfo[0]).join(",") + "\n";
    const rows = moduleInfo.map(module => Object.values(module).join(",")).join("\n");
    return header + rows;
}

const exportToText = () => {
    const moduleInfo = getModuleInfo();
    return moduleInfo.map(module => {
        return `Name: ${module.name}\nID: ${module.id}\nVersion: ${module.version}\nDescription: ${module.description}\n\n`;
    }).join("");
}

const exportModuleInfo = (format) => {
    let outputData = null;
    let urlObject = null;
    switch (format) {
        case 'json':
            outputData = exportToJSON();
            urlObject = URL.createObjectURL(new Blob([outputData], { type: 'application/json' }));
            break;
        case 'xml':
            outputData = exportToXML();
            urlObject = URL.createObjectURL(new Blob([outputData], { type: 'application/xml' }));
            break;
        case 'csv':
            outputData = exportToCSV();
            urlObject = URL.createObjectURL(new Blob([outputData], { type: 'text/csv' }));
            break;
        case 'txt':
            outputData = exportToText();
            urlObject = URL.createObjectURL(new Blob([outputData], { type: 'text/plain' }));
            break;
        default:
            ui.notifications.error(game.i18n.localize("MODULE-LIST.unsup-format"));
            return;
    }

    const a = document.createElement("a");
    a.href = urlObject;
    a.download = `module-info.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(urlObject);
}

const handleClick = () => {
    const dialog = new foundry.applications.api.DialogV2({
        window: {
            title: game.i18n.localize("MODULE-LIST.dialog-title"),
        },
        content: `
            <select name="outputFormat">
                <option value="json">JSON</option>
                <option value="xml">XML</option>
                <option value="csv">CSV</option>
                <option value="txt">${game.i18n.localize("MODULE-LIST.plain-text")}</option>
            </select>
        `,
        buttons: [{
            label: game.i18n.localize("MODULE-LIST.export"),
            callback: (event, button, dialog) => button.form.elements.outputFormat.value,
            default: true,
            action: "export",
        }, {
            label: game.i18n.localize("MODULE-LIST.cancel"),
            action: "cancel",
        }],
        submit: result => {
            if (result !== 'cancel') {
                exportModuleInfo(result);
            }
        }
    })

    dialog.render(true);
}

Hooks.once("ready", () => {
    const settingsBar = document.querySelector(".settings-sidebar");
    if (settingsBar) {
        let gameSubmenu = settingsBar.querySelector("#settings-game");
        if (game.version.startsWith("12.")) {
            gameSubmenu = settingsBar.querySelector("#settings-game");
        } else {
            gameSubmenu = settingsBar.querySelector(".settings");
        }
        if (gameSubmenu) {
            const reportButton = document.createElement("button");
            reportButton.type = "button";
            reportButton.innerHTML = `<i class='fas fa-file-invoice'></i> ${game.i18n.localize("MODULE-LIST.button-title")}`;
            reportButton.classList.add("report-button");

            gameSubmenu.appendChild(reportButton);

            reportButton.addEventListener("click", handleClick);
        }
    }
})