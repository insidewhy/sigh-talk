#!/usr/bin/env zsh

if tmux new-session -c ~/projects/sigh-talk -d -s present -n sigh-talk-run 'zsh' ; then
  tmux new-window -c ~/projects/sigh-talk -n sigh-talk 'zsh'
  tmux new-window -c ~/projects/treefer -n treefer-run 'zsh'
  tmux new-window -c ~/projects/treefer -n treefer 'zsh'
  tmux new-window -c ~/projects/sigh -n sigh-run 'zsh'
  tmux new-window -c ~/projects/sigh -n sigh 'zsh'
fi
tmux a
