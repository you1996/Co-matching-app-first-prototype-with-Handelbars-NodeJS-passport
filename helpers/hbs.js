const moment = require("moment");

module.exports = {
  formatDate: function (date, format) {
    return moment(date).utc().format(format);
  },
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + " ";
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(" "));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + "...";
    }
    return str;
  },
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, "");
  },
  editIcon: function (storyUser, loggedUser, storyId, floating = true) {
    if (storyUser._id.toString() == loggedUser._id.toString()) {
      if (floating) {
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`;
      } else {
        return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`;
      }
    } else {
      return "";
    }
  },
  editProg: function (value) {
    if (value <= 49) {
      return `<div class="progress blue lighten-4 tooltipped" data-position="left" data-tooltip="You have ${value}% of similarities" style=" height:15px;">
    
    <div id="myBtn" class="determinate blue darken-2" style="width:${value}%; color:white; font-family: Arial, Helvetica, sans-serif;  animation: grow 2s;">${value}%</div>
</div>`;
    } else if (value == 50) {
      return `<div class="progress orange lighten-3 tooltipped" data-position="left" data-tooltip="You have ${value}% of similarities" style=" height:15px;">
    
    <div id="myBtn" class="determinate orange darken-4" style="width:${value}%; color:white; font-family: Arial, Helvetica, sans-serif;  animation: grow 2s;">${value}%</div>
</div>`;
    } else
      return `<div class="progress red lighten-3 tooltipped" data-position="left" data-tooltip="You have ${value}% of similarities" style=" height:15px;">
    
    <div id="myBtn" class="determinate  red darken-4" style="width:${value}%; color:white; font-family: Arial, Helvetica, sans-serif; animation: grow 2s;">${value}%</div>
</div>`;
  },
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp(">" + selected + "</option>"),
        ' selected="selected"$&'
      );
  },
};
