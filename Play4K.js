(function () {
    if (!window.Plugin) return;

    Plugin.register('kino4', {
        title: '4Kino.cc Source',
        version: '1.1',
        author: 'Ты',
        description: 'Источник для Lampa с сайта 4kino.cc',
        types: ['movie'],
        onload: function () {
            Lampa.Listener.follow('full', function (e) {
                if (e.type !== 'movie') return;

                // Проверка: есть ли совпадение по названию или году
                let search = e.card.title;

                fetch(`https://4kino.cc/index.php?do=search&subaction=search&story=${encodeURIComponent(search)}`)
                    .then(res => res.text())
                    .then(html => {
                        const matches = [...html.matchAll(/<a class="short-title".*?href="(.*?)">(.*?)<\/a>/gi)];
                        if (!matches.length) return;

                        const url = matches[0][1];

                        fetch(url)
                            .then(res => res.text())
                            .then(filmHtml => {
                                const playerMatches = [...filmHtml.matchAll(/src=["'](\/\/[^"']+player[^"']+)["']/gi)];
                                const videos = playerMatches.map((m, i) => ({
                                    file: 'https:' + m[1],
                                    quality: 'auto',
                                    title: `Плеер #${i + 1}`,
                                    url: 'https:' + m[1]
                                }));

                                if (videos.length) {
                                    Lampa.PlayerPanel.update(videos, 'kino4');
                                }
                            });
                    });
            });
        }
    });
})();
