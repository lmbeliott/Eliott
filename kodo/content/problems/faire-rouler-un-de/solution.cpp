#include <array>
#include <iostream>
#include <queue>
#include <string>
#include <vector>
using namespace std;

int r, c;

// état : (ligne, colonne, face du dessus, face nord, face est), codé par un entier
int code(int i, int j, int h, int n, int e) {
    return ((h * 7 + n) * 7 + e) * r * c + i * c + j;
}

int main() {
    int f;
    cin >> r >> c >> f;
    vector<string> grille(r);
    for (int i = 0; i < r; i++) cin >> grille[i];
    int si = 0, sj = 0;
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++)
            if (grille[i][j] == 'S') { si = i; sj = j; }
    int di[4] = {-1, 1, 0, 0}, dj[4] = {0, 0, 1, -1};
    vector<int> dist(343 * r * c, -1);
    dist[code(si, sj, 1, 2, 3)] = 0;
    queue<array<int, 5>> file;
    file.push({si, sj, 1, 2, 3});
    int reponse = -1;
    while (!file.empty()) {
        auto [i, j, h, n, e] = file.front();
        file.pop();
        int d = dist[code(i, j, h, n, e)];
        if (grille[i][j] == 'T' && h == f) {
            reponse = d;
            break;
        }
        for (int k = 0; k < 4; k++) {
            int ni = i + di[k], nj = j + dj[k];
            if (ni < 0 || ni >= r || nj < 0 || nj >= c || grille[ni][nj] == '#') continue;
            // nouvelles faces (dessus, nord, est) ; la face opposée à x est 7 - x
            int h2, n2, e2;
            if (k == 0) { h2 = 7 - n; n2 = h; e2 = e; }        // vers le nord
            else if (k == 1) { h2 = n; n2 = 7 - h; e2 = e; }   // vers le sud
            else if (k == 2) { h2 = 7 - e; n2 = n; e2 = h; }   // vers l'est
            else { h2 = e; n2 = n; e2 = 7 - h; }               // vers l'ouest
            int x = code(ni, nj, h2, n2, e2);
            if (dist[x] == -1) {
                dist[x] = d + 1;
                file.push({ni, nj, h2, n2, e2});
            }
        }
    }
    cout << reponse << "\n";
    return 0;
}
