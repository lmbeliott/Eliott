#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (int i = 0; i < n; i++) {
        cin >> g[i];
    }

    // Les 8 directions.
    int di[8] = {-1, -1, -1, 0, 0, 1, 1, 1};
    int dj[8] = {-1, 0, 1, -1, 1, -1, 0, 1};

    vector<vector<bool>> attaquee(n, vector<bool>(m, false));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (g[i][j] == 'D') {
                for (int d = 0; d < 8; d++) {
                    int a = i + di[d];
                    int b = j + dj[d];
                    // Les bornes d'abord, puis le contenu de la case.
                    while (0 <= a && a < n && 0 <= b && b < m && g[a][b] == '.') {
                        attaquee[a][b] = true;
                        a = a + di[d];
                        b = b + dj[d];
                    }
                }
            }
        }
    }

    int total = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (attaquee[i][j]) {
                total = total + 1;
            }
        }
    }
    cout << total << "\n";
    return 0;
}
