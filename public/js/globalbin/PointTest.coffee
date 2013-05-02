gb.model.Point = (x, y) ->
  @x = x
  @y = y

gb.model.Point::toString = ->
  "Point(" + @x + "," + @y + ")"

gb.model.Point::distance = (point) ->
  xDistance = point.x - @x
  yDistance = point.y - @y
  Math.sqrt (xDistance * xDistance) + (yDistance * yDistance)

gb.model.Point::theta = (point) ->
  rise = point.y - @y
  run = point.x - @x
  Math.atan2 rise, run