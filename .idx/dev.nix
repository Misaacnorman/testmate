
{ pkgs, ... }: {
  # Environment configuration for your workspace.
  #
  # This is a standard Nix file and is fully customizable.
  # To learn more about how to configure your environment with Nix,
  # see the official documentation:
  #   https://nixos.org/manual/nix/stable/language/
  #
  # To see the packages available for you to use, search on nixhub.io.
  
  # The following is a sample configuration that sets up a Next.js development environment.
  channel = "stable-23.11"; # The Nixpkgs channel to use.
  packages = [
    pkgs.nodejs_20
  ];
  
  # Enable the Node.js process manager for this workspace.
  preprocesses = {
    npm = {
      install = {
        enable = true;
        packageManager = "npm";
      };
    };
  };

  # The commented out section below is an example of how to set up a
  # preview for a web app that listens on port 3000.
  #
  # previews = [
  #   {
  #     # The command to run to start the preview.
  #     command = "npm run dev";
  #
  #     # The port to expose.
  #     port = 3000;
  #
  #     # The label to display in the editor.
  #     label = "Web";
  #   }
  # ];
}
