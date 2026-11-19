export const profile = {
  name: 'Nyx',
  avatar: 'assets/nyx-avatar.gif',
  discordId: '1295772114359681138',
  invite: 'https://discord.gg/P75SKfpPgF',
};

document.querySelectorAll('[data-profile-name]').forEach(el => { el.textContent = profile.name; });
document.querySelectorAll('[data-profile-avatar]').forEach(el => { el.src = profile.avatar; });
document.querySelectorAll('[data-discord-profile]').forEach(el => {
  el.href = 'https://discord.com/users/' + profile.discordId;
});
document.querySelectorAll('[data-discord-invite]').forEach(el => { el.href = profile.invite; });
document.title = profile.name + ' / Portfolio Concept';
