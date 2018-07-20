This server is responsible for the following

adding/removing printers
adding/removing colors
knowing what color is where

commanding the octoprints
the webpage for the average user
the display for the corner television


bash
  when computer starts
  start octoprints
  start OctoHandler


onstartup
  configures octoprints to connect to appropriate tty ports


Pages

  setup
    (if remote) displays error, directs user to setup in tech bunker
    (if local)
      wiggles each connected printer
      asks for user input to determine name

  index
    redirects to onstartup
    small stats
      name
      color
      progress
      heat
      file to print
    tools
      upload stl/gcode
      choose slicing profile
      upload new slicing profile
        save to octoprints config file
      task printer (add to printer's que)(autoslice stl)
    links to printer unique pages

  display
    redirects to onstartup
    stats for all the printers
      name
      colors
      progress
      heat
      file to print
    tools (only for local)
      printer swap
      color swap
    links to printer-unique pages

  printer-unique
    redirects to onstartup
    stats
      color
      is operational
      is in use
      heat
      file to print
    tools (only for local)
      move axes
      heat
      replace filament
