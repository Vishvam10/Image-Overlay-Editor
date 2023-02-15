export default function assignParent(labels, new_label, from="") {
  const [xl, yl, wl, hl] = new_label["coordinates"];

  let min_x_diff_1 = 1000000;
  let min_x_diff_2 = 1000000;

  let min_x_diff_3 = 1000000;
  let min_x_diff_4 = 1000000;

  let min_y_diff_1 = 1000000;
  let min_y_diff_2 = 1000000;

  let min_y_diff_3 = 1000000;
  let min_y_diff_4 = 1000000;

  new_label["parent"] = null;

  labels.forEach((ele) => {
    const [xc, yc, wc, hc] = ele["coordinates"];

    const x_diff_1 = xl - xc;
    const x_diff_2 = xl - xc - wc;

    const x_diff_3 = xl + wl - xc;
    const x_diff_4 = xl + wl - xc - wc;

    const y_diff_1 = yl - yc;
    const y_diff_2 = yl - yc - hc;

    const y_diff_3 = yl + hl - yc;
    const y_diff_4 = yl + hl - yc - hc;

    let temp = 0;
    if(ele["id"] != new_label["id"]) {
      if (
        x_diff_1 >= 0 &&
        x_diff_2 <= 0 &&
        y_diff_1 >= 0 &&
        y_diff_2 <= 0 &&
        x_diff_3 >= 0 &&
        x_diff_4 <= 0 &&
        y_diff_1 >= 0 &&
        y_diff_2 <= 0 &&
        x_diff_3 >= 0 &&
        x_diff_4 <= 0 &&
        y_diff_3 >= 0 &&
        y_diff_4 <= 0 &&
        x_diff_1 >= 0 &&
        x_diff_2 <= 0 &&
        y_diff_3 >= 0 &&
        y_diff_4 <= 0
      ) {
        new_label["parent"] = ele["id"];
  
        if (x_diff_1 < min_x_diff_1) {
          min_x_diff_1 = x_diff_1;
          temp += 1;
        }

        if (x_diff_2 < min_x_diff_2) {
          min_x_diff_2 = x_diff_2;
          temp += 1;
        }
  
        if (x_diff_3 < min_x_diff_3) {
          min_x_diff_3 = x_diff_3;
          temp += 1;
        }

        if (x_diff_4 < min_x_diff_4) {
          min_x_diff_4 = x_diff_4;
          temp += 1;
        }
  
        if (y_diff_1 < min_y_diff_1) {
          min_y_diff_1 = y_diff_1;
          temp += 1;
        }

        if (y_diff_2 < min_y_diff_2) {
          min_y_diff_2 = y_diff_2;
          temp += 1;
        }
  
        if (y_diff_3 < min_y_diff_3) {
          min_y_diff_3 = y_diff_3;
          temp += 1;
        }
  
        if (y_diff_4 < min_y_diff_4) {
          min_y_diff_4 = y_diff_4;
          temp += 1;
        }
  
        if (temp == 8) {
          new_label["parent"] = ele["id"];
        }
      }
    } 
  });
}
