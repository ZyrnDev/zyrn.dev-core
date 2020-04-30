class Table {
    constructor(selectorString, rowToHTML_Function) {
        this.selector = selectorString;
        this.table = $(selectorString);
        this.rows = [];
        this.rowToHTML = rowToHTML_Function;
    }
  
    populate(rows) {
        this.rows = rows;
        this.reloadRows();
    }
  
    clear() {
        this.table.find("tbody tr td").remove();
    }
  
    reloadRows() {
        this.clear();
        for (const row of this.rows)  {
            this.table.find("tbody").append(this.rowToHTML(row));
        }
    }
  
    add(row, index) {
        let position = (index === undefined) ? this.rows.length : index;
        this.rows.splice(position, 0, row);
        this.reloadRows();
    }
  
    remove(removalFunctionOrIndex) {
        let indices;
        if (typeof removalFunctionOrIndex === "function") {
            indices = [];
            for (let i = 0; i < this.rows.length; i++)  {
                if (removalFunctionOrIndex(this.rows[i], i) == true) {
                    indices.push(i);
                }
            }
        } else {
            indices = [removalFunctionOrIndex];
        }
        arrayRemoveIndices(this.rows, indices);
        this.reloadRows();
    }

    replace(row, removalFunctionOrIndex) {
        let indices;
        if (typeof removalFunctionOrIndex === "function") {
            indices = [];
            for (let i = 0; i < this.rows.length; i++)  {
                if (removalFunctionOrIndex(this.rows[i], i) == true) {
                    indices.push(i);
                }
            }
        } else {
            indices = [removalFunctionOrIndex];
        }
        for (const index of indices) {
            this.rows.splice(index, 1, row);
        }
        this.reloadRows();
    }
  
    message(msg) {
      this.clear();
      this.table.append("<tr><td>"+ msg +"</td></tr>");
    }

    error(msg) {
      this.clear();
      this.table.append('<tr class="error failed"><td class="error failed">'+ msg +'</td></tr>');
    }
}