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

    for (int j = 0; j < m; j++) {
        int libre = n - 1;                  // ligne où se posera la prochaine pierre
        for (int i = n - 1; i >= 0; i--) {  // de bas en haut
            if (g[i][j] == '#') {
                libre = i - 1;
            } else if (g[i][j] == 'o') {
                g[i][j] = '.';              // on retire la pierre avant de la poser
                g[libre][j] = 'o';
                libre = libre - 1;
            }
        }
    }

    for (int i = 0; i < n; i++) {
        cout << g[i] << "\n";
    }
    return 0;
}
