#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    int n;
    cin >> n;
    vector<bool> vu(n + 1, false);   // la réponse est entre 0 et n
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (x <= n) {
            vu[x] = true;
        }
    }
    int v = 0;
    while (vu[v]) {                  // s'arrête au plus tard en v = n
        v = v + 1;
    }
    cout << v << "\n";
    return 0;
}
