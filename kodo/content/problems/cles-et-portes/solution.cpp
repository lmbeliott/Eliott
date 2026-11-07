#include <iostream>
#include <queue>
#include <string>
#include <tuple>
#include <vector>
using namespace std;

int main() {
    int r, c;
    cin >> r >> c;
    vector<string> grille(r);
    for (int i = 0; i < r; i++) cin >> grille[i];
    int si = 0, sj = 0;
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++)
            if (grille[i][j] == 'S') { si = i; sj = j; }
    // un état (i, j, clés) est codé par l'entier (clés * r + i) * c + j
    auto code = [&](int i, int j, int cles) { return (cles * r + i) * c + j; };
    vector<int> dist(64 * r * c, -1);
    dist[code(si, sj, 0)] = 0;
    queue<tuple<int, int, int>> file;
    file.push({si, sj, 0});
    int di[4] = {-1, 1, 0, 0}, dj[4] = {0, 0, -1, 1};
    int reponse = -1;
    while (!file.empty()) {
        auto [i, j, cles] = file.front();
        file.pop();
        int d = dist[code(i, j, cles)];
        if (grille[i][j] == 'T') {
            reponse = d;
            break;
        }
        for (int k = 0; k < 4; k++) {
            int ni = i + di[k], nj = j + dj[k];
            if (ni < 0 || ni >= r || nj < 0 || nj >= c) continue;
            char cs = grille[ni][nj];
            if (cs == '#') continue;
            if (cs >= 'A' && cs <= 'F' && !((cles >> (cs - 'A')) & 1)) continue;   // porte fermée
            int nouvelles = cles;
            if (cs >= 'a' && cs <= 'f') nouvelles = cles | (1 << (cs - 'a'));      // on ramasse la clé
            int e = code(ni, nj, nouvelles);
            if (dist[e] == -1) {
                dist[e] = d + 1;
                file.push({ni, nj, nouvelles});
            }
        }
    }
    cout << reponse << "\n";
    return 0;
}
