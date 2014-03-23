// Generated by CoffeeScript 1.3.3
(function() {
  var addBikeContainer, collapseToggle, fillInBike, getAndSetManufacturerList, getFrameModel, getModelList, initialBike, initialize, resetContainerCount, setModelList, showNotFound, targetBike, updateModelDisplay, updateYear, urlParam;

  resetContainerCount = function() {
    var bc;
    bc = $('#bikes-container .bike').length;
    if (bc === 0) {
      addBikeContainer();
      $("#bikes-container").removeClass().addClass("showing-1-bikes");
    }
    if (bc < 3) {
      $("#bikes-container").removeClass().addClass("showing-" + bc + "-bikes");
    }
    if (bc > 2) {
      return $("#bikes-container").removeClass().addClass('showing-many-bikes');
    }
  };

  collapseToggle = function(e) {
    var cat, closed, section, target, _i, _len, _ref;
    target = $(e.target);
    target.parents('.comp_cat_wrap').find('dl').slideToggle(300);
    target.parents('.comp_cat_wrap').toggleClass('closed');
    closed = [];
    section = target.parents('.model-display');
    _ref = section.find('.comp_cat_wrap');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cat = _ref[_i];
      if (section.find(cat).hasClass('closed')) {
        closed.push(section.find(cat).attr('data-cat'));
      }
    }
    return $("#collapsed-cats").data('collapsed', closed);
  };

  urlParam = function(name) {
    var results, url;
    url = window.location.href;
    results = new RegExp("[\\?&]" + name + "=([^&#]*)").exec(url);
    if (!results) {
      return 0;
    }
    return results[1] || 0;
  };

  initialBike = function() {
    var bike;
    return bike = {
      manufacturer: urlParam('s_manufacturer'),
      year: urlParam('s_year'),
      frame_model: urlParam('s_frame_model')
    };
  };

  showNotFound = function(target, bike) {
    var error;
    bike.manufacturer = target.find("select.manufacturer-select option[value=" + bike.manufacturer + "]").text();
    if (target.find('h3 strong').length > 0) {
      bike.frame_model = target.find('h3 strong').text();
    }
    error = $(Mustache.to_html($('#errors_tmpl').html(), bike));
    target.find('.selectors').append(error);
    error.fadeIn();
    return setTimeout((function() {
      return error.fadeOut();
    }), 4000);
  };

  getAndSetManufacturerList = function() {
    return $.ajax({
      type: "GET",
      url: "/assets/select_list.json",
      success: function(data, textStatus, jqXHR) {
        $('#base_tmpl').html($(Mustache.to_html($('#base_tmpl').html(), data)));
        return addBikeContainer(initialBike());
      }
    });
  };

  getModelList = function(target, bike) {
    var url;
    if (bike == null) {
      bike = {};
    }
    if (!((bike.year != null) && (bike.manufacturer != null))) {
      bike = targetBike(target);
    }
    url = "/?manufacturer=" + bike.manufacturer + "&year=" + bike.year;
    return $.ajax({
      type: "GET",
      url: url,
      success: function(data, textStatus, jqXHR) {
        return setModelList(target, data, bike);
      }
    });
  };

  getFrameModel = function(target, bike) {
    var url;
    if (bike == null) {
      bike = {};
    }
    if (bike.frame_model == null) {
      bike = targetBike(target);
    }
    if (!((bike.frame_model != null) && bike.frame_model.length > 0)) {
      return null;
    }
    url = "/?manufacturer=" + bike.manufacturer + "&year=" + bike.year + "&frame_model=" + bike.frame_model;
    return $.ajax({
      type: "GET",
      url: url,
      success: function(data, textStatus, jqXHR) {
        target.find('.model-display').fadeOut(200, function() {
          return updateModelDisplay(target, data);
        });
        url = "" + window.location.protocol + "//" + window.location.host + "/?s_manufacturer=" + bike.manufacturer + "&s_year=" + bike.year + "&s_frame_model=" + bike.frame_model;
        target.find('.share-bike a').attr('href', url);
        target.find('.share-bike input').val(url);
        target.find('.share-bike').fadeIn();
        return target.data('bike', bike);
      },
      error: function(data) {
        return showNotFound(target, bike);
      }
    });
  };

  setModelList = function(target, data, bike) {
    var model_select;
    if (bike == null) {
      bike = {};
    }
    if (data == null) {
      return null;
    }
    if (bike.frame_model == null) {
      bike = targetBike(target);
    }
    model_select = target.find('.model-select-contain');
    model_select.empty().html(Mustache.to_html($('#models_tmpl').html(), data));
    model_select.find('select.model-select').val(bike.frame_model);
    model_select.find('select').select2({
      placeholder: "Select model",
      allow_clear: true,
      escapeMarkup: function(m) {
        return m;
      }
    });
    model_select.fadeIn('fast');
    return getFrameModel(target, bike);
  };

  updateYear = function(target, bike) {
    var data, mnfg, s_year, year;
    if (bike == null) {
      bike = {};
    }
    mnfg = target.find('select.manufacturer-select option:selected');
    year = target.find('select.year-select');
    if (bike.manufacturer == null) {
      bike = targetBike(target);
    }
    if ((bike.manufacturer != null) && bike.manufacturer.length > 0) {
      data = JSON.parse("[" + (mnfg.attr('data-years')) + "]");
      year.html(Mustache.to_html($('#years_tmpl').html(), data));
      year.select2("enable", true);
      if ((bike.year != null) && bike.year.length > 3) {
        s_year = bike.year;
      } else {
        s_year = data[0];
        bike.year = s_year;
      }
      year.select2("val", s_year);
      return getModelList(target, bike);
    } else {
      year.select2("enable", false);
      return target.find('.model-select-contain').fadeOut('fast', function() {
        return target.find('.model-select-contain').empty();
      });
    }
  };

  updateModelDisplay = function(target, data) {
    var bike, c, closed, comp, desc, dlgroup, field, fields, groups, name, tires, wheel_sizes, _i, _j, _k, _len, _len1, _len2, _ref, _results;
    if (data == null) {
      data = [];
    }
    target.find('.model-display').html(Mustache.to_html($('#details_tmpl').html(), data));
    target.find('.model-display').fadeIn();
    fields = ['.bike-base', '.frameandfork', '.drivetrainandbrakes', '.wheels', '.additionalparts'];
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

  addBikeContainer = function(bike) {
    var target;
    if (bike == null) {
      bike = {};
    }
    $('#base_tmpl .bike').clone().appendTo('#staging');
    target = $('#staging .bike');
    if (bike.manufacturer != null) {
      target.find('.manufacturer-select').val(bike.manufacturer);
    }
    $("#bikes-container").append(target);
    resetContainerCount();
    target.find('.manufacturer-select').select2({
      placeholder: "Choose manufacturer",
      allow_clear: true
    });
    target.find('.year-select').select2({
      placeholder: "Year",
      allow_clear: true
    });
    target.fadeIn();
    return updateYear(target, bike);
  };

  targetBike = function(target) {
    var bike;
    return bike = {
      manufacturer: target.find('select.manufacturer-select').val(),
      year: target.find('select.year-select').val(),
      frame_model: target.find('select.model-select').val()
    };
  };

  fillInBike = function(target, bike) {
    target.data('bike', bike);
    return target.find('select.manufacturer-select').val(bike.manufacturer).trigger('change');
  };

  initialize = function() {
    getAndSetManufacturerList();
    $('#new-compare').on('click', function(e) {
      e.preventDefault();
      if ($('#bikes-container .bike').length > 0) {
        if ($('#bikes-container .bike').last().data('bike')) {
          return addBikeContainer($('#bikes-container .bike').last().data('bike'));
        } else {
          return addBikeContainer(targetBike($('#bikes-container .bike').last()));
        }
      } else {
        return addBikeContainer();
      }
    });
    $('#bikes-container').on('click', '.close', function(e) {
      e.preventDefault();
      return $(e.target).parents('.bike').fadeOut(300, function() {
        $(e.target).parents('.bike').remove();
        return resetContainerCount();
      });
    });
    $('#bikes-container').on('click', '.comp_cat_link', function(e) {
      e.preventDefault();
      return collapseToggle($(e.target));
    });
    $('#bikes-container').on('click', '.comp_cat_link', function(e) {
      e.preventDefault();
      return collapseToggle(e);
    });
    $('#bikes-container').on('change', 'select.manufacturer-select', function(e) {
      var target;
      target = $(e.target).parents('.bike');
      target.find('select.model-select').val("");
      return updateYear(target);
    });
    $('#bikes-container').on('change', 'select.year-select', function(e) {
      return getModelList($(e.target).parents('.bike'));
    });
    return $('#bikes-container').on('change', 'select.model-select', function(e) {
      return getFrameModel($(e.target).parents('.bike'));
    });
  };

  $(document).ready(function() {
    $('#bikes-container').css('min-height', "" + ($(window).height() * .75) + "px");
    return setTimeout((function() {
      $('#initial').addClass('off-screen');
      initialize();
      return setTimeout((function() {
        return $('#initial').addClass('removed');
      }), 500);
    }), 700);
  });

}).call(this);
