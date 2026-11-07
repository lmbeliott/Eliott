#include <iostream>
#include <queue>
#include <string>
#include <utility>
#include <vector>
using namespace std;

int main() {
    int r, c;
    cin >> r >> c;
    vector<string> plateau(r);
    for (int i = 0; i < r; i++) cin >> plateau[i];
    int sx = 0, sy = 0, tx = 0, ty = 0;
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            if (plateau[i][j] == 'S') { sx = i; sy = j; }
            if (plateau[i][j] == 'T') { tx = i; ty = j; }
        }
    }
    int dx[8] = {1, 2, 2, 1, -1, -2, -2, -1};
    int dy[8] = {2, 1, -1, -2, -2, -1, 1, 2};
    vector<vector<int>> dist(r, vector<int>(c, -1));
    dist[sx][sy] = 0;
    queue<pair<int, int>> file;
    file.push({sx, sy});
    while (!file.empty()) {
        auto [x, y] = file.front();
        file.pop();
        for (int d = 0; d < 8; d++) {
            int nx = x + dx[d], ny = y + dy[d];
            if (nx >= 0 && nx < r && ny >= 0 && ny < c && plateau[nx][ny] != '#' && dist[nx][ny] == -1) {
                dist[nx][ny] = dist[x][y] + 1;
                file.push({nx, ny});
            }
        }
    }
    cout << dist[tx][ty] << "\n";
    return 0;
}
