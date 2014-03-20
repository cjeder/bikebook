// Generated by CoffeeScript 1.3.3
(function() {
  var addBike, collapseToggle, getBike, getModelList, initialize, setModelList, updateManufacturer, updateModelDisplay;

  updateManufacturer = function(e) {
    var data, mnfg, target, year;
    target = $(e.target);
    mnfg = target.parents('.selectors').find('select.manufacturer-select option:selected');
    year = target.parents('.selectors').find('select.year-select');
    if (mnfg.val().length !== 0) {
      data = JSON.parse("[" + (mnfg.attr('data-years')) + "]");
      year.html(Mustache.to_html($('#years_tmpl').html(), data));
      year.select2("enable", true);
      year.select2("val", data[0]);
      return getModelList(e);
    } else {
      year.select2("enable", false);
      return model_list.fadeOut('fast', function() {
        return model_list.empty();
      });
    }
  };

  getModelList = function(e) {
    var mnfg, model_list, target, url, year;
    target = $(e.target);
    year = target.parents('.selectors').find('select.year-select').val();
    model_list = target.parents('.selectors').find('.model-select-contain');
    mnfg = target.parents('.selectors').find('select.manufacturer-select').val();
    url = "/?manufacturer=" + mnfg + "&year=" + year;
    return $.ajax({
      type: "GET",
      url: url,
      success: function(data, textStatus, jqXHR) {
        return setModelList(model_list, data);
      }
    });
  };

  getBike = function(e) {
    var mnfg, model, target, url, year;
    target = $(e.target);
    year = target.parents('.selectors').find('select.year-select').val();
    model = target.parents('.selectors').find('select.model-select').val();
    mnfg = target.parents('.selectors').find('select.manufacturer-select').val();
    if (!(model.length > 0)) {
      return true;
    }
    url = "/?manufacturer=" + mnfg + "&year=" + year + "&frame_model=" + model;
    return $.ajax({
      type: "GET",
      url: url,
      success: function(data, textStatus, jqXHR) {
        return target.parents('section').find('.model-display').fadeOut(200, function() {
          return updateModelDisplay(target.parents('section'), data);
        });
      }
    });
  };

  updateModelDisplay = function(target, data) {
    var bike, c, closed, comp, desc, dlgroup, field, fields, groups, name, tires, wheel_sizes, _i, _j, _k, _len, _len1, _len2, _ref, _results;
    if (data == null) {
      data = [];
    }
    target.find('.model-display').html(Mustache.to_html($('#details_tmpl').html(), data));
    target.find('.model-display').fadeIn();
    fields = ['.bikebase', '.frameandfork', '.drivetrainandbrakes', '.wheels', '.additionalparts'];
    bike = data["bike"];
    if (bike['rear_wheel_bsd'] !== void 0) {
      tires = '';
      wheel_sizes = JSON.parse($('#wheel_sizes').attr('data-sizes'));
      desc = wheel_sizes[bike['rear_wheel_bsd']];
      if (bike['rear_tire_narrow'] !== void 0) {
        tires = bike['rear_tire_narrow'] === 'true' ? 'skinny' : 'fat';
        tires = "(" + tires + " tires)";
      }
      target.find(".w-size").html("" + desc + " " + tires);
    } else {
      target.find(".dt-w-size, .w-size").hide();
    }
    _ref = data["components"];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      comp = _ref[_i];
      name = comp["component_type"].replace(/_/g, ' ');
      if (comp["front_or_rear"] === "both") {
        name += "s";
      } else if (comp["front_or_rear"] === "front") {
        name = "front " + name;
      } else if (comp["front_or_rear"] === "rear") {
        name = "rear " + name;
      }
      dlgroup = comp["cgroup"].replace(/\s+/g, '').toLowerCase();
      c = "<dt>" + name + "</dt><dd>" + comp["description"] + "</dd>";
      target.find("." + dlgroup + " dl").append(c);
    }
    for (_j = 0, _len1 = fields.length; _j < _len1; _j++) {
      field = fields[_j];
      if (target.find("" + field + " dd").length === 0) {
        target.find("" + field).fadeOut('fast');
      }
    }
    groups = $("#collapsed-cats").data('collapsed');
    if (groups.length > 0) {
      _results = [];
      for (_k = 0, _len2 = groups.length; _k < _len2; _k++) {
        closed = groups[_k];
        _results.push(target.find(closed).toggleClass('closed').find('dl').hide());
      }
      return _results;
    }
  };

  setModelList = function(target, data) {
    if (data == null) {
      data = [];
    }
    target.html(Mustache.to_html($('#models_tmpl').html(), data));
    target.find('select').select2({
      placeholder: "Select model"
    });
    return target.fadeIn('fast');
  };

  addBike = function() {
    return $.ajax({
      type: "GET",
      url: "/assets/select_list.json",
      success: function(data, textStatus, jqXHR) {
        var html;
        html = $(Mustache.to_html($('#base_tmpl').html(), data));
        $("#bikes-container").append(html);
        html.find('.manufacturer-select').select2({
          placeholder: "Choose manufacturer",
          allow_clear: true
        });
        html.find('.year-select').select2({
          placeholder: "Year"
        });
        return html.fadeIn();
      }
    });
  };

  collapseToggle = function(target) {
    var cat, closed, section, _i, _len, _ref;
    target.parents('.comp_cat_wrap').find('dl').slideToggle(300);
    target.parents('.comp_cat_wrap').toggleClass('closed');
    closed = [];
    section = target.parents('.model-details');
    _ref = section.find('.comp_cat_wrap');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cat = _ref[_i];
      if (section.find(cat).hasClass('closed')) {
        closed.push(section.find(cat).attr('data-cat'));
      }
    }
    return $("#collapsed-cats").data('collapsed', closed);
  };

  initialize = function() {
    addBike();
    $('#new-compare').on('click', function(e) {
      e.preventDefault();
      return addBike();
    });
    $('#bikes-container').on('click', '.close', function(e) {
      e.preventDefault();
      return $(e.target).parents('.bike').fadeOut(300, function() {
        return $(e.target).parents('.bike').remove();
      });
    });
    $('#bikes-container').on('click', '.comp_cat_link', function(e) {
      e.preventDefault();
      return collapseToggle($(e.target));
    });
    $('#bikes-container').on('change', 'select.model-select', function(e) {
      return getBike(e);
    });
    $('#bikes-container').on('change', 'select.manufacturer-select', function(e) {
      return updateManufacturer(e);
    });
    return $('#bikes-container').on('change', 'select.year-select', function(e) {
      return getModelList(e);
    });
  };

  $(document).ready(function() {
    return setTimeout((function() {
      $('#initial').addClass('off-screen');
      initialize();
      return setTimeout((function() {
        return $('#initial').addClass('removed');
      }), 500);
    }), 700);
  });

}).call(this);
