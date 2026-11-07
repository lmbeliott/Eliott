#include <iostream>
#include <queue>
#include <string>
#include <utility>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int r, c;
    cin >> r >> c;
    vector<string> image(r);
    for (int i = 0; i < r; i++) cin >> image[i];
    vector<vector<bool>> vu(r, vector<bool>(c, false));
    int dx[4] = {-1, 1, 0, 0}, dy[4] = {0, 0, -1, 1};
    int regions = 0, plus_grande = 0;
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            if (vu[i][j]) continue;
            // nouvelle région : parcours en largeur depuis (i, j)
            regions++;
            char couleur = image[i][j];
            vu[i][j] = true;
            queue<pair<int, int>> file;
            file.push({i, j});
            int taille = 0;
            while (!file.empty()) {
                auto [x, y] = file.front();
                file.pop();
                taille++;
                for (int d = 0; d < 4; d++) {
                    int nx = x + dx[d], ny = y + dy[d];
                    if (nx >= 0 && nx < r && ny >= 0 && ny < c && !vu[nx][ny] && image[nx][ny] == couleur) {
                        vu[nx][ny] = true;
                        file.push({nx, ny});
                    }
                }
            }
            plus_grande = max(plus_grande, taille);
        }
    }
    cout << regions << " " << plus_grande << "\n";
    return 0;
}
