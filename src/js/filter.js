import draw_bp from './bloodpressure.js';
import draw_cood from './linechart.js';
var dataset;
async function load_data() {
    dataset = await d3.csv("./data/final_data.csv");
}
load_data();
// filter values

var disease = 'select';
var gender = 'select';
var disease_code = 'select';


export default function filter_data(el) {
    disease = document.getElementById("diseases");
    gender = document.getElementById("gender");
    disease_code = document.getElementById("disease_code");
    var gender_val = gender.value;
    var disease_val = disease.value;
    var code_val = disease_code.value;
    var data = dataset;
    // console.log('try', data)
    if (gender_val != "both" && gender_val != "select") {
        gender_val = gender_val.toUpperCase();
        data = data.filter(function (row) {
            return row.SEX == gender_val;
        });
    }

    if (disease_val != "both" && disease_val != "select") {
        disease_val = disease_val.toUpperCase();
        data = data.filter(function (row) {
            return row.SEX == disease_val;
        });
    }

    if (code_val != "both" && code_val != "select") {
        code_val = code_val.toUpperCase();
        data = data.filter(function (row) {
            return row.Diagnosis_Code == code_val;
        });
    }

    // console.log("data", data);
    draw_bp(data);
    draw_cood(data);
}