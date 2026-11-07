#include <iostream>
#include <string>
using namespace std;

int main() {
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        string mot;
        cin >> mot;
        int n = mot.size();
        // On essaie les périodes p = 1, 2, 3… : la première qui marche est la plus courte.
        // p = n marche toujours, car il n'y a alors aucune lettre à comparer.
        int p = 1;
        while (p < n) {
            bool ok = true;
            for (int i = 0; i + p < n; i++) {
                if (mot[i] != mot[i + p]) {
                    ok = false;
                    break;
                }
            }
            if (ok) break;
            p = p + 1;
        }
        cout << p << " " << mot.substr(0, p) << "\n";
    }
    return 0;
}
