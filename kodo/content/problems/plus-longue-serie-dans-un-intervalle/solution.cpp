#include <iostream>
using namespace std;

int main() {
    int n, a, b;
    cin >> n >> a >> b;
    int en_cours = 0, record = 0;
    for (int i = 0; i < n; i++) {
        int t;
        cin >> t;
        if (a <= t && t <= b) {
            en_cours = en_cours + 1;
            if (en_cours > record) {
                record = en_cours;
            }
        } else {
            en_cours = 0;
        }
    }
    cout << record << "\n";
    return 0;
}
