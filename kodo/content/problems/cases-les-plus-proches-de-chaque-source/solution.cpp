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
    vector<string> grille(r);
    for (int i = 0; i < r; i++) cin >> grille[i];
    const int DISPUTEE = 26;
    vector<vector<int>> dist(r, vector<int>(c, -1)), proprio(r, vector<int>(c, -1));
    queue<pair<int, int>> file;
    vector<bool> presente(26, false);
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            if (grille[i][j] >= 'A' && grille[i][j] <= 'Z') {   // toutes les sources partent ensemble
                dist[i][j] = 0;
                proprio[i][j] = grille[i][j] - 'A';
                presente[grille[i][j] - 'A'] = true;
                file.push({i, j});
            }
        }
    }
    int dx[4] = {-1, 1, 0, 0}, dy[4] = {0, 0, -1, 1};
    while (!file.empty()) {
        auto [x, y] = file.front();
        file.pop();
        for (int d = 0; d < 4; d++) {
            int nx = x + dx[d], ny = y + dy[d];
            if (nx < 0 || nx >= r || ny < 0 || ny >= c || grille[nx][ny] == '#') continue;
            if (dist[nx][ny] == -1) {
                dist[nx][ny] = dist[x][y] + 1;
                proprio[nx][ny] = proprio[x][y];
                file.push({nx, ny});
            } else if (dist[nx][ny] == dist[x][y] + 1 && proprio[nx][ny] != proprio[x][y]) {
                proprio[nx][ny] = DISPUTEE;
            }
        }
    }
    vector<int> compte(27, 0);
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++)
            if (proprio[i][j] != -1) compte[proprio[i][j]]++;
    for (int k = 0; k < 26; k++)
        if (presente[k]) cout << char('A' + k) << " " << compte[k] << "\n";
    cout << compte[DISPUTEE] << "\n";
    return 0;
}
